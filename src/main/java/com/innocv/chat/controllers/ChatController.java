package com.innocv.chat.controllers;

import com.innocv.chat.model.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

  private final SimpMessagingTemplate template;

  @Autowired
  public ChatController(SimpMessagingTemplate template) {
    this.template = template;
  }

  @MessageMapping("/message")
  public void message(ChatMessage message) {
    if (message.isGeneral()) {
      template.convertAndSend("/topic/general", message);
    }

    message.getToStream().forEach(to -> {
      template.convertAndSend("/topic/" + to, message);
    });
  }

}
