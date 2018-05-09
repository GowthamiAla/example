package com.mss.solar.maps;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;



@SpringBootApplication
@EnableEurekaClient
public class SolarMapsApplication {

	public static void main(String[] args) {
		SpringApplication.run(SolarMapsApplication.class, args);
	}
}
