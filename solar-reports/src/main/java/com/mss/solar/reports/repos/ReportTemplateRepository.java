package com.mss.solar.reports.repos;

import org.springframework.data.jpa.repository.JpaRepository;


import com.mss.solar.reports.domain.ReportTemplate;
import com.mss.solar.reports.domain.ReportTemplateName;

public interface ReportTemplateRepository extends JpaRepository<ReportTemplate, Long> {

	
	ReportTemplate findById(Long id);

	ReportTemplate findByTemplateName(ReportTemplateName templateName);

}
