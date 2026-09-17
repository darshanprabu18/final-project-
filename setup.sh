
#!/bin/bash

# Create unique database name from request ID
DATABASE_NAME="f2e11f06_2c96_4922_be09_be1fb3da0d37"

# Create MySQL database
mysql -u root -pexamly -e "CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME};" 2>/dev/null || echo "Database creation failed, will use default"

# Define project directory
PROJECT_DIR="/home/coder/project/workspace/question_generation_service/solutions/f2e11f06-2c96-4922-be09-be1fb3da0d37/springapp"

# Generate Spring Boot project using Spring CLI
spring init \
  --type=maven-project \
  --language=java \
  --boot-version=3.4.0 \
  --packaging=jar \
  --java-version=17 \
  --groupId=com.examly \
  --artifactId=springapp \
  --name="Crowdfunding Platform" \
  --description="Crowdfunding Platform with Campaign Management and Donation System" \
  --package-name=com.examly.springapp \
  --dependencies=web,data-jpa,validation,mysql \
  --build=maven \
  ${PROJECT_DIR}

# Wait for project generation to complete
sleep 2

# Create application.properties with MySQL configuration
cat > "${PROJECT_DIR}/src/main/resources/application.properties" << EOL
spring.datasource.url=jdbc:mysql://localhost:3306/${DATABASE_NAME}?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=examly
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=create
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
EOL
