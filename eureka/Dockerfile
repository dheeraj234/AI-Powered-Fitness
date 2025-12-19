# Use Java 21 (Render supported)
FROM eclipse-temurin:21-jdk

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom FIRST to use cache
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Give execute permission to Maven wrapper
RUN chmod +x mvnw

# Download dependencies (cached)
RUN ./mvnw dependency:go-offline

# Copy project source
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# EXPOSE Eureka port
EXPOSE 8761

# Run the JAR
CMD ["java", "-jar", "target/eureka-0.0.1-SNAPSHOT.jar"]
