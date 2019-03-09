package com.innocv.chat.model;

import java.util.List;
import java.util.stream.Stream;
import lombok.Data;

@Data
public class ChatMessage {

  private String from;
  private String text;
  private List<String> to;

  public boolean isGeneral() {
    return to.contains("General");
  }

  public Stream<String> getToStream() {
    return to.stream().filter(t -> !"General".equals(t));
  }

}
