FROM java:8
VOLUME /tmp
RUN apt-get update -y && apt-get install -y supervisor
RUN groupadd -r app && useradd -r -gapp app
RUN mkdir -m 0755 -p /usr/local/app/bin
RUN mkdir -m 0755 -p /usr/local/app/config
RUN mkdir -m 0755 -p /usr/local/app/logs/

COPY solar-discovery.jar /usr/local/app/bin
COPY solar-config.jar /usr/local/app/bin
COPY solar-core.jar /usr/local/app/bin
COPY solar-dashboard.jar /usr/local/app/bin
COPY solar-maps.jar /usr/local/app/bin
COPY solar-calendar.jar /usr/local/app/bin
COPY solar-reports.jar /usr/local/app/bin

COPY app-supervisor.conf /etc/supervisor/conf.d


EXPOSE 28080

CMD ["/usr/bin/supervisord", "-n"]