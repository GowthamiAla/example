package com.mss.solar.reports.svcs;

import java.sql.SQLException;
import java.util.Map;
import java.util.Set;

import javax.sql.rowset.serial.SerialException;
import javax.validation.constraints.NotNull;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.mss.solar.reports.common.ReportFormatType;

import com.mss.solar.reports.common.RestApiUrlConstants;

import com.mss.solar.reports.domain.ReportTemplate;
import com.mss.solar.reports.model.ServiceResponse;

@RequestMapping(value = "/api/reports")
public interface ReportService {

	@PostMapping(RestApiUrlConstants.GENERATE_REPORT)
	@ResponseBody
	ServiceResponse<ReportTemplate> generateReport(@RequestBody Map<String, String> dataMap,
			@PathVariable("templateName") String templateName);
	
	@PostMapping(RestApiUrlConstants.SAVE_REPORT)
	@ResponseBody
	ServiceResponse<ReportTemplate> saveReport(@PathVariable("templateName") String templateName,
			@PathVariable("formatType") ReportFormatType formatType,@RequestParam("reportData") MultipartFile reportData) throws SerialException, SQLException;

	@GetMapping(RestApiUrlConstants.GET_REPORT)
	@ResponseBody
	ServiceResponse<Set<ReportTemplate>> getReportTemplate();
	
	@DeleteMapping(RestApiUrlConstants.REPORT_BY_ID)
	@ResponseBody
	ServiceResponse<String> delete(@NotNull @PathVariable("id") Long id);

	
	
}


