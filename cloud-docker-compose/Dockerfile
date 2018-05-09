FROM mysql:5.7

# Environment variables
ENV MYSQL_ROOT_PASSWORD=HdC7hj2hF8nK
ENV MYSQL_DATABASE=solar
ENV MYSQL_USER=solar
ENV MYSQL_PASSWORD=solar
RUN echo "lower_case_table_names=1" >> /etc/mysql/mysql.conf.d/mysqld.cnf
COPY Solar.sql /docker-entrypoint-initdb.d/
