package com.mss.solar.reports.svcs.impl;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.Collection;
import java.util.HashSet;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import javax.sql.rowset.serial.SerialBlob;
import javax.sql.rowset.serial.SerialException;

import org.eclipse.birt.report.engine.api.IReportEngine;
import org.eclipse.birt.report.engine.api.IReportRunnable;
import org.eclipse.birt.report.engine.api.IRunAndRenderTask;
import org.eclipse.birt.report.engine.api.PDFRenderOption;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.mss.solar.reports.auth.BirtEngineFactory;
import com.mss.solar.reports.common.EnumTypeForErrorCodes;
import com.mss.solar.reports.common.ReportFormatType;
import com.mss.solar.reports.common.Utils;
import com.mss.solar.reports.domain.ReportTemplate;
import com.mss.solar.reports.domain.ReportTemplateName;
import com.mss.solar.reports.model.ServiceResponse;
import com.mss.solar.reports.repos.ReportTemplateNameRepository;
import com.mss.solar.reports.repos.ReportTemplateRepository;
import com.mss.solar.reports.svcs.ReportService;

@Service
@RestController
public class ReportServiceImpl implements ReportService {

	private static Logger log = LoggerFactory.getLogger(ReportServiceImpl.class);

	@Autowired
	private Utils utils;

	@Autowired
	private ReportTemplateRepository tempRepo;

	@Autowired
	private BirtEngineFactory factory;

	@Autowired
	private ReportTemplateNameRepository tempNameRepo;

	@Value("${reports.url}")
	public String reportsUrl;

	@Value("${spring.datasource.url}")
	public String dataSource;

	@Value("${spring.datasource.username}")
	public String userName;

	@Value("${spring.datasource.password}")
	public String password;

	/**
	 * Report Document Service Implementation
	 * 
	 * @return void reportDocument
	 *
	 */
	public void reportDocument(String templateName, String outputDoc, Blob template, Map<String, String> dataMap) {
		log.debug("Generating Reports");

		IReportRunnable design = null;
		try {
			IReportEngine engine = factory.getObject();
			InputStream in = template.getBinaryStream();
			ReadableByteChannel rbc = Channels.newChannel(in);
			File file = new File("report.xml");
			FileOutputStream fos = new FileOutputStream(file);
			fos.getChannel().transferFrom(rbc, 0, Long.MAX_VALUE);
			fos.close();
			rbc.close();

			design = engine.openReportDesign(file.toString());

			IRunAndRenderTask task = engine.createRunAndRenderTask(design);

			task.setParameterValue("RP_datasource", dataSource);
			task.setParameterValue("RP_username", userName);
			task.setParameterValue("RP_password", password);

			for (Entry<String, String> entry : dataMap.entrySet()) {

				task.setParameterValue(entry.getKey(), entry.getValue());
			}
			task.validateParameters();
			PDFRenderOption PDF_OPTIONS = new PDFRenderOption();
			PDF_OPTIONS.setOutputFormat("pdf");

			PDF_OPTIONS.setOutputFileName(reportsUrl + "/" + outputDoc);

			task.setRenderOption(PDF_OPTIONS);
			task.run();
			task.close();

		} catch (Exception e) {
			log.error("Error in getting Document Data", e);
		}
	}

	/**
	 * Generate Report Service Implementation
	 * 
	 * @RequestBody Map<String, String> dataMap
	 * @param templateName
	 * @return ServiceResponse<ReportTemplate>
	 * 
	 */
	@Override
	public ServiceResponse<ReportTemplate> generateReport(@RequestBody Map<String, String> dataMap,
			@PathVariable("templateName") String templateName) {

		ServiceResponse<ReportTemplate> response = new ServiceResponse<ReportTemplate>();

		try {
			String outputDoc = "";
			ReportTemplateName reportTemplateNameExist = tempNameRepo.findByTemplateName(templateName);
			ReportTemplate reportTemplateExist = tempRepo.findByTemplateName(reportTemplateNameExist);
			String str = "";
			for (Entry<String, String> entry : dataMap.entrySet()) {
				str = entry.getValue();
				outputDoc += str + "_";
			}
			outputDoc += templateName + ".pdf";
			if (reportTemplateExist != null) {
				Blob template = reportTemplateExist.getTemplate();
				reportDocument(templateName, outputDoc, template, dataMap);
				response.setData(null);
			} else {
				response.setError(EnumTypeForErrorCodes.SCUS603.name(), EnumTypeForErrorCodes.SCUS603.errorMsg());
			}
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS602.name(), EnumTypeForErrorCodes.SCUS602.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * updateReport Service Implementation
	 * 
	 * @param templateName,formatType
	 * @Requestparam reportData
	 * @return ServiceResponse<ReportTemplate>
	 * 
	 */
	@Override
	public ServiceResponse<ReportTemplate> saveReport(@PathVariable("templateName") String templateName,
			@PathVariable("formatType") ReportFormatType formatType,
			@RequestParam("reportData") MultipartFile reportData) throws SerialException, SQLException {
		log.info("Saving Report Template");

		ServiceResponse<ReportTemplate> response = new ServiceResponse<>();
		try {
			ReportTemplateName reportTemplateNameExist = tempNameRepo.findByTemplateName(templateName);
			ReportTemplate reportTemplateExist = tempRepo.findByTemplateName(reportTemplateNameExist);
			ReportTemplate newReportTemplate = new ReportTemplate();
			ReportTemplateName newReportTemplateName = new ReportTemplateName();
			if (reportTemplateExist == null) {
				byte[] byteReport = reportData.getBytes();
				SerialBlob blob = new SerialBlob(byteReport);
				newReportTemplate.setTemplate(blob);
				if (reportTemplateNameExist == null) {
					newReportTemplateName.setTemplateName(templateName);
					tempNameRepo.save(newReportTemplateName);
					newReportTemplate.setTemplateName(newReportTemplateName);
				} else {
					newReportTemplate.setTemplateName(reportTemplateNameExist);
				}
				newReportTemplate.setFormatType(formatType);
				tempRepo.save(newReportTemplate);
			} else {
				response.setError(EnumTypeForErrorCodes.SCUS604.name(), EnumTypeForErrorCodes.SCUS604.errorMsg());
			}
		} catch (IOException e) {

			e.printStackTrace();
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS606.name(), EnumTypeForErrorCodes.SCUS606.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * getReportTemplate Service Implementation
	 * 
	 * @return ServiceResponse<Set<ReportTemplate>>
	 *
	 */
	@Override
	public ServiceResponse<Set<ReportTemplate>> getReportTemplate() {

		ServiceResponse<Set<ReportTemplate>> response = new ServiceResponse<>();
		log.info("Getting Template List");
		try {
			Collection<ReportTemplate> templates = tempRepo.findAll();
			Set<ReportTemplate> templateSet = new HashSet<>();
			for (ReportTemplate reportTemplate : templates) {

				ReportTemplate newReportTemplate = new ReportTemplate();
				newReportTemplate.setId(reportTemplate.getId());
				newReportTemplate.setTemplateName(reportTemplate.getTemplateName());
				newReportTemplate.setFormatType(reportTemplate.getFormatType());
				templateSet.add(newReportTemplate);
			}
			response.setData(templateSet);
		} catch (Exception exception) {

			response.setError(EnumTypeForErrorCodes.SCUS607.name(), EnumTypeForErrorCodes.SCUS607.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

	/**
	 * deleteReport Service Implementation
	 * 
	 * @param id
	 * @return ServiceResponse<ReportTemplate>
	 * 
	 */
	@Override
	public ServiceResponse<String> delete(@PathVariable("id") Long id) {

		ServiceResponse<String> response = new ServiceResponse<String>();
		log.info("Deleting Report Template");
		try {
			ReportTemplate reportTemplate = tempRepo.findById(id);

			if (reportTemplate != null) {

				tempRepo.delete(reportTemplate);
				response.setData("Template deleted successfully ");
			} else {
				response.setError(EnumTypeForErrorCodes.SCUS608.name(), EnumTypeForErrorCodes.SCUS608.errorMsg());
			}
		} catch (Exception exception) {
			response.setError(EnumTypeForErrorCodes.SCUS609.name(), EnumTypeForErrorCodes.SCUS609.errorMsg());
			log.error(utils.toJson(response.getError()), exception);
		}
		return response;
	}

}
