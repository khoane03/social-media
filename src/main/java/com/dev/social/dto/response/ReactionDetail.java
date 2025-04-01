package com.dev.social.dto.response;

import com.dev.social.entity.Reaction;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReactionDetail {
    String id;
    String userId;
    String name;
    String avatarUrl;
    String type;

    public ReactionDetail(Reaction reaction) {
       if(reaction != null) {
            this.id = reaction.getId();
            this.userId = reaction.getUser().getId();
            this.type = reaction.getReactionType().name();
            this.name = reaction.getUser().getName();
            this.avatarUrl = reaction.getUser().getAvatarUrl();
        } else {
            this.id = null;
            this.userId = null;
            this.type = null;
            this.name = null;
            this.avatarUrl = null;
        }
    }

}
