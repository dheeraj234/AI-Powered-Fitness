FROM eclipse-temurin:21-jdk

WORKDIR /app
COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

EXPOSE 8888
CMD ["java", "-jar", "target/configserver-0.0.1-SNAPSHOT.jar"]
