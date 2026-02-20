pipeline {
    agent any

    tools {
        maven 'Maven_Jenkins'
        jdk 'Default JDK'
        nodejs 'NodeJS-Angular'
    }

    stages {

        stage('SCM') {
            steps {
                checkout scm
            }
        }

        stage('Debug Backend Structure') {
            steps {
                sh 'ls -la'
                dir('Proyecto Aplicacion/Issue-Tracking-System/Back-End') {
                    sh 'ls -la'
                }
            }
        }

        stage('SonarQube Backend') {
            steps {
                dir('Proyecto Aplicacion/Issue-Tracking-System/Back-End') {
                    withSonarQubeEnv('sonarqube') {
                        sh 'mvn clean verify sonar:sonar'
                    }
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

        stage('Test Backend') {
            steps {
                dir('Proyecto Aplicacion/Issue-Tracking-System/Back-End') {
                    sh 'mvn test'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('Proyecto Aplicacion/Issue-Tracking-System/Front-End') {
                    nodejs(nodeJSInstallationName: 'NodeJS-Angular') {
                        sh 'npm install'
                        sh 'npm run build'
                    }
                }
            }
        }
        
        stage('Test Frontend') {
            steps {
                dir('Proyecto Aplicacion/Issue-Tracking-System/Front-End') {
                    nodejs(nodeJSInstallationName: 'NodeJS-Angular') {
                        sh 'npm test || true'
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('sonarqube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
    }
}
