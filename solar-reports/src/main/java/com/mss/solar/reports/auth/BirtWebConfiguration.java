package com.mss.solar.reports.auth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.BeanNameViewResolver;

@EnableWebMvc
@ComponentScan({ "com.mss.solar" })
@Configuration
public class BirtWebConfiguration extends WebMvcConfigurerAdapter {


	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		registry.addViewController("/reports").setViewName("birtView");

	}

	@Bean
	public BirtView birtView() {
		BirtView bv = new BirtView();
		bv.setBirtEngine(this.engine().getObject());
		return bv;
	}

	@Bean
	public BeanNameViewResolver beanNameResolver() {
		BeanNameViewResolver br = new BeanNameViewResolver();
		return br;
	}

	@Bean
	protected BirtEngineFactory engine() {
		BirtEngineFactory factory = new BirtEngineFactory();
		return factory;
	}
}
