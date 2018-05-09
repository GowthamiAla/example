import { Component} from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';


import { endponitConfig } from '../../../../environments/endpoints';
declare var $;

@Component({
	template : ""
})

export class WeatherComponent {
    private headers: Headers;

	constructor(private router: Router,private http: Http) { 
		 this.headers = new Headers();
    	this.headers.append('Content-Type', 'application/json');
		//this.headers.set('X-Auth-Token', localStorage.getItem('token'));
		   this.headers.set('X-Auth-Token', localStorage.getItem('token'));
	}
	public displayWeatherInformation(lat,lon,loadnum,driverName) {
        $(".weather_details").css({"display":"block"});	
		 $(".loader").css({"display":"block"});
		 $(".popup_header").css({"display":"none"});
		 $(".weatherAvailable").css({"display":"none"});
		 $(".weatherDetailsNotAvailable").css({"display":"none"});
		 $("#overlay").css({"display":"block"});
		  
		  $(".current_conditions").html("<b>Driver: "+driverName+"</b> - Current weather conditions are");
		 
		  this.http.get(endponitConfig.PALS_DRIVERS_ENDPOINT+'weather-info/'+loadnum+'/'+lat+'/'+lon,{ headers: this.headers }).subscribe(function(response) {

                var result = response.json();

			  	$(".weather_details .clearingData").html('');
			  	$(".loader").css({"display":"none"});
			  	$(".popup_header").css({"display":"block"});
			 	$(".weatherAvailable").css({"display":"block"});
			  
			  	// Display Location Name 
			  	$(".weather_details .location_name").text(result.data.name+" ( "+result.data.id+" )");	
			  
			  	// Display Lat, Lon, Elev 
			  	$(".weather_details .lat_lon_elev").html('');
			  	$(".weather_details .lat_lon_elev")
			  			.append("<label class = 'lat_value'><span class = 'lat_text'>Lat: </span> "+result.data.latitude+"</label")
		    			.append("<label class = 'lat_value'>&deg;N</label>")
		    			.append("  &nbsp;&nbsp;<label class = 'lat_value'><span class = 'lat_text'>Lon:</span> "+result.data.longitude+"</label")
		    			.append("<label class = 'lat_value'>&deg;W</label>")
		    			.append("  &nbsp;&nbsp;<label class = 'lat_value'><span class = 'lat_text'>Elev:</span> "+result.data.elev+"ft</label");
			  
			  	// Display Weather Image
			  	$(".weather_details .weather_image").html('');
			  	$(".weather_details .weather_image")
		    			.append('<img src = "http://forecast.weather.gov/newimages/medium/'+result.data.weatherimage+'"/>')
			  	
		    	// Display Weather, Temperature in F and C
		    	var tempF = result.data.temp;
			  	var tempC = (tempF-32)*5/9;
			  	tempC = Math.round(tempC);
			  	 
			  	$(".weather_details .few_clouds").text(result.data.weather);
			  	$(".weather_details .temp").text(result.data.temp).append("<label>&deg;F</label>");
		    	$(".weather_details .tempC").text(tempC).append("<label>&deg;C</label>");
		    	
		    	
		    	// Display Humidity
		    	$(".weather_details .humidity").text(result.data.relh+"%");
		    	
		    	// Display Wind Speed
		    	var windDirectionAngle = result.data.windd,
		    		windDirection,
		    		windSpeed = result.data.winds,
		    		gust = result.data.gust;
		    	
		    	
		    	if((windDirectionAngle >= 0 && windDirectionAngle < 22.5)){
		    		windDirection = 'N'
		    	}else if(windDirectionAngle == 22.5){
		    		windDirection = 'NNE'
		    	}else if((windDirectionAngle > 22.5 && windDirectionAngle < 67.5)){
		    		windDirection = 'NE'
		    	}else if(windDirectionAngle == 67.5){
		    		windDirection = 'ENE'
		    	}else if((windDirectionAngle > 67.5 && windDirectionAngle < 112.5)){
		    		windDirection = 'E'
		    	}else if(windDirectionAngle == 112.5){
		    		windDirection = 'ESE'
		    	}else if((windDirectionAngle > 112.5 && windDirectionAngle < 157.5)){
		    		windDirection = 'SE'
		    	}else if(windDirectionAngle == 157.5){
		    		windDirection = 'SSE'
		    	}else if((windDirectionAngle > 157.5 && windDirectionAngle < 202.5)){
		    		windDirection = 'S'
		    	}else if(windDirectionAngle == 202.5){
		    		windDirection = 'SSW'
		    	}else if((windDirectionAngle > 202.5 && windDirectionAngle < 247.5)){
		    		windDirection = 'SW'
		    	}else if(windDirectionAngle == 247.5){
		    		windDirection = 'WSW'
		    	}else if((windDirectionAngle > 247.5 && windDirectionAngle < 292.5)){
		    		windDirection = 'W'
		    	}else if(windDirectionAngle == 292.5){
		    		windDirection = 'WNW'
		    	}else if((windDirectionAngle > 292.5 && windDirectionAngle < 337.5)){
		    		windDirection = 'NW'
		    	}else if(windDirectionAngle == 337.5){
		    		windDirection = 'NNW'
		    	}else if((windDirectionAngle > 337.5 && windDirectionAngle <= 360)){
		    		windDirection = 'N'
		    	}
		    	if(windSpeed == 0 && windDirectionAngle == 0){
		    		$(".weather_details .wind_speed").text("Calm");
		    	}else if(windSpeed == 0 && windDirectionAngle == "NA"){
		    		$(".weather_details .wind_speed").text("NA");
		    	}else {
		    		if(gust == 0 || gust == 'NA'){
			    		$(".weather_details .wind_speed").text(windDirection+" "+result.data.winds+" MPH");
			    	}else{
			    		$(".weather_details .wind_speed").text(windDirection+" "+result.data.winds+" G "+gust+" MPH");
			    	} 
		    	}
		    	
		    	// Display Barometer
		    	var altimeter = result.data.altimeter;
		    	
		    	if(altimeter == 0){
		    		$(".weather_details .barometer").text(result.data.slp);
		    	}else{
		    		$(".weather_details .barometer").text(result.data.slp+" in ("+result.data.altimeter+" mb)");
		    	}
		    	
		    	// Display Dew Point
		    	var dewpF = result.data.dewp;
			  	var dewpC = (dewpF-32)*5/9;
			  	dewpC = Math.round(dewpC);
			  	
		    	$(".weather_details .dew_point").text(result.data.dewp)
					.append("<label>&deg;F</label>")
					.append(" <label>("+dewpC+"</label>")
					.append("<label>&deg;C)</label>");
		    	
		    	// Display Visibility
		    	$(".weather_details .visibility").text(result.data.visibility+" mi");
		    	
		    	// Display Heat Index
		    	var humidity = result.data.relh;
			  	var heatIndexF,heatIndexC;
			  	
			  	if(tempF > 80 && humidity > 40 && dewpF > 60){
			  		
			  		$(".weather_details .heat_index_header").css('display','block');
			  		$(".weather_details .heat_index").css('display','block');
			  		
			  		heatIndexF =  -42.379 
			  					  + 2.04901523*tempF 
			  					  + 10.14333127*humidity 
			  					  - .22475541*tempF*humidity 
									  - .00683783*tempF*tempF 
									  - .05481717*humidity*humidity 
									  + .00122874*tempF*tempF*humidity 
									  + .00085282*tempF*humidity*humidity 
									  - .00000199*tempF*tempF*humidity*humidity;
			  		
			  		heatIndexF = Math.round(heatIndexF);
				  	heatIndexC = (heatIndexF-32)*5/9;
				  	heatIndexC = Math.round(heatIndexC);
				  	
				  	$(".weather_details .heat_index").text(heatIndexF)
				  		.append("<label>&deg;F</label>")
				  		.append(" <label>("+heatIndexC+"</label>")
				  		.append("<label>&deg;C)</label>");
				  	
			  	}else{
			  		$(".weather_details .heat_index_header").css('display','none');
			  		$(".weather_details .heat_index").css('display','none');
			  	}
			  	
		    	// Display Last Update
		    	$(".weather_details .last_update").text(result.data.date);
		},
		function(error) { 
			$(".weather_details .clearingData").html('');
			$(".loader").css({"display":"none"});
			$(".current_conditions").html("<b>Driver: "+name+"</b><br/>").css({'margin-bottom':'20px'});
			$(".popup_header").css({"display":"block"});
			$(".weatherDetailsNotAvailable").css({"display":"block"});
			$(".weatherDetailsNotAvailable").append("Weather conditions are not available for this location..");
		});

		$("#overlay").click(function(){
			$(this).css({"display":"none"});	
			$(".weather_details").hide();
		});	
		$('#close').click(function() {
			$("#overlay").css({"display":"none"});	
			$(".weather_details").hide();
		});
    }
}
