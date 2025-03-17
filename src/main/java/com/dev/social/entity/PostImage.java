package com.dev.social.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "tbl_posts_images")
public class PostImage extends BaseEntity {

    @Column(name = "image_url")
    String imageUrl;

    @ManyToOne
    @JoinColumn(name = "post_id")
    Post post;
}
