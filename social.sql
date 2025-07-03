create table if not exists public.tbl_users
(
    id          varchar(100) not null primary key,
    username    varchar(30)  not null unique,
    name        varchar(50)  not null,
    phone       varchar(15) unique,
    email       varchar(30)  not null unique,
    password    varchar(100) not null,
    avatar_url  varchar(200),
    cover_url   varchar(200),
    status      varchar(20)  not null,
    is_verified boolean,
    created_at  timestamp,
    updated_at  timestamp
);

alter table public.tbl_users
    owner to postgres;

create table if not exists public.tbl_info
(
    id            varchar(100) not null primary key,
    date_of_birth date,
    gender        varchar(10),
    address       varchar(100),
    user_id       varchar(100) not null,
    created_at    timestamp,
    updated_at    timestamp
);

alter table public.tbl_info
    owner to postgres;

create table if not exists public.tbl_roles
(
    id         varchar(100) not null primary key,
    role_name  varchar(20)  not null,
    created_at timestamp,
    updated_at timestamp
);

alter table public.tbl_roles
    owner to postgres;

create table if not exists public.tbl_user_roles
(
    user_id varchar(255) not null
        constraint fk references public.tbl_users,
    role_id varchar(255) not null
        constraint fk2 references public.tbl_roles,
    primary key (user_id, role_id)
);

alter table public.tbl_user_roles
    owner to postgres;

create table if not exists public.tbl_posts
(
    id         varchar(100) not null primary key,
    user_id    varchar(100) not null,
    contents   text         not null,
    created_at timestamp,
    updated_at timestamp
);

alter table public.tbl_posts
    owner to postgres;

create table if not exists public.tbl_posts_images
(
    id         varchar(100) not null primary key,
    post_id    varchar(100) not null,
    image_url  varchar(200) not null,
    created_at timestamp,
    updated_at timestamp
);

alter table public.tbl_posts_images
    owner to postgres;

create table if not exists public.tbl_comments
(
    id         varchar(100) not null primary key,
    post_id    varchar(100) not null,
    user_id    varchar(100) not null,
    contents   text         not null,
    created_at timestamp,
    updated_at timestamp
);

alter table public.tbl_comments
    owner to postgres;

create table if not exists public.tbl_reaction
(
    id            varchar(100) not null primary key,
    post_id       varchar(100) not null,
    user_id       varchar(100) not null,
    reaction_type varchar(20)  not null,
    created_at    timestamp,
    updated_at    timestamp
);

alter table public.tbl_reaction
    owner to postgres;

create table if not exists public.tbl_friends
(
    id         varchar(100) not null primary key,
    user_id    varchar(100) not null,
    friend_id  varchar(100) not null,
    status     varchar(20)  not null,
    created_at timestamp,
    updated_at timestamp
);

alter table public.tbl_friends
    owner to postgres;

create table if not exists public.tbl_notifications
(
    id         varchar(100) not null primary key,
    user_id    varchar(100) not null,
    contents   text         not null,
    status     varchar(20)  not null,
    created_at timestamp,
    updated_at timestamp
);

alter table public.tbl_notifications
    owner to postgres;

create table if not exists public.tbl_chats
(
    id           varchar(100) not null primary key,
    sender_id    varchar(100) not null,
    recipient_id varchar(100) not null,
    contents     text         not null,
    created_at   timestamp,
    updated_at   timestamp
);

alter table public.tbl_chats
    owner to postgres;

create table if not exists public.tbl_blacklist
(
    id         varchar(100) not null primary key,
    token_id   varchar(100) not null,
    exp        timestamp,
    created_at timestamp,
    updated_at timestamp
);

alter table public.tbl_blacklist
    owner to postgres;

