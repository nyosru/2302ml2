# FROM php:8.1-apache
# FROM php:5.4-apache
FROM php:7.4-apache
# FROM ubuntu:latest
# FROM php:7.1-apache
# FROM php:7.4-fpm
# FROM php:7.4-alpine

LABEL maintainer="1@php-cat.com"

# Добавим свой php.ini, можем в нем определять свои значения конфига
ADD php.ini php.ini /usr/local/etc/php/conf.d/40-custom.ini

# определение папки паблик как стартовая
# ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
# ENV APACHE_DOCUMENT_ROOT=/var/www/html
# RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
# RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# RUN apt-get update && \
#      apt-get install -y \
#          libzip-dev \
    # docker-php-ext-install \
RUN docker-php-ext-install \
    # curl \
    #  добавка для работы phpmy admin
    pdo_mysql mysqli \ 
    #    && docker-php-ext-install -j$(nproc) iconv mbstring mysqli pdo_mysql zip \
    # && iconv mbstring mysqli pdo_mysql \
    && a2enmod \
    rewrite

# RUN apt-get update
# RUN apt install zip unzip php-zip

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl \
    libonig-dev \
    locales \
    nodejs \
    npm \
    zlib1g-dev \
    libicu-dev \
    supervisor \
    g++ \
    --no-install-recommends \
    && rm -r /var/lib/apt/lists/* \
    && sed -i 's/# ru_RU.UTF-8 UTF-8/ru_RU.UTF-8 UTF-8/' /etc/locale.gen \
    && locale-gen

RUN apt-get update && apt-get install -y libbz2-dev
RUN docker-php-ext-install bz2

# RUN docker-php-ext-install fontconfig
RUN apt-get update \
     && apt-get install -y fontconfig 
     #freetype2 
     
RUN apt-get update \
     && apt-get install -y build-essential chrpath libssl-dev libxft-dev

# # штуки zip для работы композера
RUN apt-get update \
     && apt-get install -y libzip-dev \
     && docker-php-ext-install zip 

RUN apt-get update && \
    apt-get install -y libxml2-dev     


# RUN apt-get update && \
#     apt-get install -y phantomjs


# RUN apt-get install build-essential chrpath libssl-dev libxft-dev libfreetype6-dev libfreetype6 libfontconfig1-dev libfontconfig1 -y
# # RUN wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2
# # RUN wget https://repo1.maven.org/maven2/com/github/klieber/phantomjs/2.1.1/phantomjs-2.1.1-linux-x86_64.tar.bz2
# RUN sudo wget http://files.php-cat.com/phantomjs-2.1.1-linux-x86_64.tar.bz2
# RUN tar xvjf phantomjs-2.1.1-linux-x86_64.tar.bz2 -C /usr/local/share/
# RUN ln -s /usr/local/share/phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/local/bin/










# RUN docker-php-ext-install soap

# # RUN apt-get update && apt-get install -y \
# #     libmcrypt-dev \
# #     && docker-php-ext-install -j$(nproc) mcrypt

# # Install composer
# # RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# # Install composer
# # RUN curl -sS https://getcomposer.org/installer | php -- \
# #         --filename=composer \
# #         --install-dir=/usr/local/bin && \
# #         echo "alias composer='composer'" >> /root/.bashrc && \
# #         composer

# # RUN composer install --prefer-source --no-interaction

# # Install NPM
# RUN curl https://www.npmjs.com/install.sh | sh

RUN apt-get install -y curl && curl -sL https://deb.nodesource.com/setup_lts.x | bash - && apt-get install -y nodejs && curl -L https://www.npmjs.com/install.sh | sh
RUN npm install -g appcenter-cli

# USER www-data
# RUN sudo chown -R 33:33 "/var/www/.npm"
# # # RUN cd /var/www/html
# # CMD cd /var/www/html
# # # # RUN cd html
# # # RUN curl -sS https://getcomposer.org/installer -o composer-setup.php
# # CMD curl -sS https://getcomposer.org/installer -o composer-setup.php
# # # RUN php composer-setup.php
# # CMD php composer-setup.php
# # # # RUN php composer-setup.php
# # # RUN rm composer-setup.php
# # # RUN php composer.phar install
# # CMD php composer.phar install

EXPOSE 80