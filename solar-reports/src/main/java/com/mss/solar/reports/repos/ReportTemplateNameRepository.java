package com.mss.solar.reports.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mss.solar.reports.domain.ReportTemplateName;

public interface ReportTemplateNameRepository extends JpaRepository<ReportTemplateName, Long> {

	ReportTemplateName findByTemplateName(String templateName);

}
