package com.mss.solar.reports;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class SolarReportsApplication {

	public static void main(String[] args) {
		SpringApplication.run(SolarReportsApplication.class, args);
	}
}
