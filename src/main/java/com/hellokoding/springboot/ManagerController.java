package com.hellokoding.springboot;


import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;


@Controller
public class ManagerController 
{
	
	@Value("${remoteServer.autURL}")
    private String endpoint;
	
	@RequestMapping(value = {"","/login"}, method = RequestMethod.GET)
	public String loginPage() {
		return "login";
	}
	@RequestMapping(value = {"/home"}, method = RequestMethod.GET)
	public String homePage() {
		return "home";
	}
	@RequestMapping(value = "/home", method = RequestMethod.POST)
	public String homePage(HttpServletRequest request, HttpServletResponse response) 
	{
		 
		try
		{
			String userName = request.getParameter("userName");
	        String password = request.getParameter("password");
	        
	        JwtAuthenticationRequest authenticationRequest = new JwtAuthenticationRequest();
	        authenticationRequest.setPassword(password);
	        authenticationRequest.setUsername(userName);
	        
			RestTemplate restTemplate = new RestTemplate();
		    HttpHeaders headers = new HttpHeaders();
	        headers.setContentType(MediaType.APPLICATION_JSON);
	        HttpEntity<JwtAuthenticationRequest> entity = new HttpEntity<JwtAuthenticationRequest>(authenticationRequest, headers);
	        ResponseEntity<JwtAuthenticationResponse> responseEntity = restTemplate.exchange(endpoint, HttpMethod.POST, entity, JwtAuthenticationResponse.class);
			
			//final ResponseEntity<JwtAuthenticationRequest> responseEntity = restTemplate.postForEntity(endpoint, authenticationRequest ,JwtAuthenticationRequest.class);
			System.out.println("Response Body  :: " +responseEntity.getBody().getToken());
			
			if ( responseEntity != null && "Success".equalsIgnoreCase(responseEntity.getBody().getMessage()))
			{
				request.setAttribute("token", responseEntity.getBody().getToken());
				return "home";
			}
			else
			{
				request.setAttribute("message", "The Username or Password is invalid");
				return "login";
			}
		}
		catch (Exception e)
		{
			request.setAttribute("message", "The Username or Password is invalid");
			return "login";
		}
	}
	@RequestMapping("/commonJSP")
    public ModelAndView getView(HttpServletRequest request, HttpServletResponse response)
    {
    	String viewName = request.getParameter("screenId");
        ModelAndView modelAndView = new ModelAndView("Page");
        
        modelAndView.addObject("viewName", viewName);
        return modelAndView;
    }
}