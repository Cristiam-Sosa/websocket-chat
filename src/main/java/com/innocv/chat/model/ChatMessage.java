package com.innocv.chat.model;

import java.util.List;
import lombok.Data;

@Data
public class ChatMessage {

  private String from;
  private String text;
  private List<String> to;

  public boolean isTo(String toUser) {
    return to.contains(toUser);
  }
}
