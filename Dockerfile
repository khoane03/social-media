# ---------------------------
# Stage 1: Build the app
# ---------------------------
FROM gradle:8.4-jdk17 AS builder

# Copy entire project into the container
COPY --chown=gradle:gradle . /home/gradle/project
WORKDIR /home/gradle/project

# Build the application using Gradle Wrapper
RUN ./gradlew bootJar

# ---------------------------
# Stage 2: Run the app
# ---------------------------
FROM openjdk:17-jdk-slim

# Copy the built jar from the previous stage
COPY --from=builder /home/gradle/project/build/libs/*.jar app.jar

# Run the app
ENTRYPOINT ["java","-Duser.timezone=Asia/Ho_Chi_Minh", "-jar", "/app.jar"]
