FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app
COPY . .
RUN chmod +x mvnw
# Build the application
RUN ./mvnw clean package -DskipTests -q

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-Xmx512m", "-jar", "app.jar"]
