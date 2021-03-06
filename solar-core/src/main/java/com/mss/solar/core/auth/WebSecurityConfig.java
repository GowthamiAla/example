package com.mss.solar.core.auth;

import static com.mss.solar.core.auth.SecurityConstants.SIGN_UP_URL;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private UserDetailsService userDetailsService;

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Autowired
	private CustomAuthFailureHandler customAuthFailureHandler;

	public void WebSecurity(UserDetailsService userDetailsService) {
		this.userDetailsService = userDetailsService;

	}

	

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors()
				.and()
				.authorizeRequests()
				.antMatchers(HttpMethod.POST, SIGN_UP_URL).hasAnyAuthority("USER", "ADMIN","DRIVER","DCMANAGER")
				.anyRequest()
				.authenticated().antMatchers("/**").anonymous().and().csrf().disable()
				.formLogin()
				.loginPage("/index.html")
				.loginProcessingUrl("/login").failureHandler(customAuthFailureHandler).and()
				.logout()
				.deleteCookies("JSESSIONID")
				.invalidateHttpSession(true)
				.and().sessionManagement()
				.maximumSessions(1)
				.and()
				.sessionFixation()
				.migrateSession().and()
				.addFilter(new JWTAuthenticationFilter(authenticationManager()))
				.addFilter(new JWTAuthorizationFilter(authenticationManager()))
				// this disables session creation on Spring Security
				.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
		

		
	}

	@Override
	public void configure(WebSecurity web) throws Exception {
		web.ignoring().antMatchers("/", "/*.html", "/*.js", "/*.css", "/assets/**");
		web.ignoring().antMatchers("/api/users/registerUser", "/api/users/setPassword/**",
				"/api/users/forgotPassword/**", "/api/users/addUser/**", "/api/users/updateUser/**",
				"/api/users/deleteUser/**", "/api/notifications/**", "/macys-dashboard/**", "/solar-ws/**");
		web.ignoring().antMatchers(HttpMethod.OPTIONS, "/**");
	}

	@Override
	public void configure(AuthenticationManagerBuilder auth) throws Exception {

		auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder());

	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", new CorsConfiguration().applyPermitDefaultValues());
		return source;
	}
}
