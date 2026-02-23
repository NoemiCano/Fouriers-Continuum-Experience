pipeline {
    agent any

    tools { 
        nodejs 'NodeJS-Angular'
        maven "Maven_Jenkins"
        jdk "Default JDK"
    }

    environment {
        SONARQUBE_ENV = 'sonarqube'
    }

    stages {

        stage('SCM') {
            steps {
                checkout scm
            }
        }

        stage('Install Front-end Dependencies') {
            steps {
                dir('Proyecto Aplicacion/Issue-Tracking-System/Front-End') {
                    sh 'npm install --ignore-scripts'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('Proyecto Aplicacion/Issue-Tracking-System/Front-End') {
                    sh 'npm run build -- --prod'
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('Proyecto Aplicacion/Issue-Tracking-System/Back-End') {
                    sh 'mvn clean compile'
                }
            }
        }

        stage('SonarQube Analysis Backend') {
            steps {
                dir('Proyecto Aplicacion/Issue-Tracking-System/Back-End') {
                    withSonarQubeEnv("${SONARQUBE_ENV}") {
                        sh 'mvn sonar:sonar'
                    }
                }
            }
        }

        stage('SonarQube Analysis Frontend') {
            steps {
                nodejs(nodeJSInstallationName: 'NodeJS-Moderno') {
                    dir('Proyecto Aplicacion/Issue-Tracking-System/Front-End') {
                        withSonarQubeEnv('sonarqube') {
                            sh "${tool('SonarScanner')}/bin/sonar-scanner"
                        }
                    }
                }
            }
        }
    }
}
