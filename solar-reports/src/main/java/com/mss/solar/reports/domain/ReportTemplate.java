package com.mss.solar.reports.domain;

import java.sql.Blob;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.mss.solar.reports.common.ReportFormatType;

/**
 * Document entity
 *
 */
@Entity
@Table(name = "reporttemplate")
public class ReportTemplate {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private ReportFormatType formatType;

	private Blob template;
	
	@ManyToOne
	@JoinColumn(name="templatename")
	private ReportTemplateName templateName;
	

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public ReportFormatType getFormatType() {
		return formatType;
	}

	public void setFormatType(ReportFormatType formatType) {
		this.formatType = formatType;
	}

	public Blob getTemplate() {
		return template;
	}

	public void setTemplate(Blob template) {
		this.template = template;
	}

	public ReportTemplateName getTemplateName() {
		return templateName;
	}

	public void setTemplateName(ReportTemplateName templateName) {
		this.templateName = templateName;
	}

	
	
}
