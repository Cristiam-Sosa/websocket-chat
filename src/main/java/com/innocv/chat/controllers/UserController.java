package com.innocv.chat.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class UserController {

  private final SimpMessagingTemplate template;

  @Autowired
  public UserController(SimpMessagingTemplate template) {
    this.template = template;
  }

  @MessageMapping("/connected")
  public void connected(String user) {
    template.convertAndSend("/topic/user", user);
  }

}
