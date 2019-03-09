package com.innocv.chat.controllers;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class UserController {

  private final SimpMessagingTemplate template;
  private List<String> users = new ArrayList<>();

  @Autowired
  public UserController(SimpMessagingTemplate template) {
    this.template = template;
  }

  @MessageMapping("/connected")
  public void connected(@Payload String user) {
    template.convertAndSend("/topic/all/user", user);

    users.forEach(u -> template.convertAndSend("/topic/" + user + "/user", u));

    users.add(user);
  }

}
