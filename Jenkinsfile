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

        stage('SonarQube Analysis') {
            steps {
                dir('Proyecto Aplicacion/Issue-Tracking-System/Front-End') {
                    withSonarQubeEnv('sonarqube') {
                        sh "mvn clean verify sonar:sonar"
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('Proyecto Aplicacion/Issue-Tracking-System/Front-End') {
                    sh 'ng build'
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
        
        
    }
}
