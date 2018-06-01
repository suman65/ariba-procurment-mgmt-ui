package com.hellokoding.springboot;

import java.io.Serializable;

public class JwtAuthenticationResponse implements Serializable {

    private static final long serialVersionUID = 1250166508152483573L;

    private  String token;
    private String message;

    public JwtAuthenticationResponse() {
    }
    public JwtAuthenticationResponse(String token,String message) {
        this.token = token;
        this.message = message;
    }

    public String getToken() {
        return this.token;
    }
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
}
