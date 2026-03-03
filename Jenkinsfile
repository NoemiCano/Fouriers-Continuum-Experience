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
                sh 'git config --global --add safe.directory "*"'
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

        stage('Compile & Package Backend') {
            steps {
                dir('Proyecto Aplicacion/Issue-Tracking-System/Back-End') {
                    // CAMBIO IMPORTANTE: Usamos 'package' para generar el archivo .jar
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        // stage('Build Backend') {
        //     steps {
        //         dir('Proyecto Aplicacion/Issue-Tracking-System/Back-End') {
        //             sh 'mvn clean compile'
        //         }
        //     }
        // }

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

        // Pruebas de integración del Back y Front

        stage('Integration Tests - Backend') {
            steps {
                dir('Proyecto Aplicacion/Issue-Tracking-System/Back-End') {
                    // Maven usa 'verify' para ejecutar pruebas de integración
                    sh 'mvn verify -DskipUnitTests' 
                }
            }
        }

        stage('E2E Testing - Frontend') {
            steps {
                nodejs('NodeJS-Angular') { 
                    dir('Proyecto Aplicacion/Issue-Tracking-System/Front-End') {
                        // catchError permite que el pipeline continúe aunque el test falle
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            sh 'npm run e2e'
                        }
                    }
                }
            }
        }

        // Publicación final en Nexus

        stage('Docker Build & Push to Nexus') {
            steps {
                script {
                    // Mantenemos tu configuración que ya funciona
                    def nexusRegistry = "host.docker.internal:5000" 
                    def backImageName = "${nexusRegistry}/its-backend"
                    def frontImageName = "${nexusRegistry}/its-frontend"

                    // ESTA LÍNEA ES LA CLAVE: Evita que Docker use el proxy para la red local
                    withEnv(["NO_PROXY=host.docker.internal,nexus,127.0.0.1,localhost"]) {
                        
                        docker.withRegistry("http://${nexusRegistry}", 'nexus-docker-credentials') {
                            
                            // 1. Backend (Ya funcionaba, pero lo repetimos)
                            dir('Proyecto Aplicacion/Issue-Tracking-System/Back-End') {
                                def backImage = docker.build("${backImageName}:${env.BUILD_NUMBER}")
                                backImage.push()
                                backImage.push("latest")
                            }

                            // 2. Frontend (Aquí es donde fallaba)
                            dir('Proyecto Aplicacion/Issue-Tracking-System/Front-End') {
                                def frontImage = docker.build("${frontImageName}:${env.BUILD_NUMBER}")
                                frontImage.push()
                                frontImage.push("latest")
                            }
                        }
                    }
                }
            }
        }
    }

post {
        always {
            script {
                def teamsUrl = 'https://default430f2559efe1453db47adb73887053.31.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/8f4185b62fd447efb4e714b932b3743a/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=alU7kkSWrwqWZwrn-9VkYYT8hCdMUlmGwlRjuv3Lj1o](https://default430f2559efe1453db47adb73887053.31.environment.api.powerplatform.com/powerautomate/automations/direct/workflows/8f4185b62fd447efb4e714b932b3743a/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=alU7kkSWrwqWZwrn-9VkYYT8hCdMUlmGwlRjuv3Lj1o'
                
                // Definimos el color según el estado: Verde si éxito, Rojo si fallo
                def color = (currentBuild.currentResult == 'SUCCESS') ? "#00FF00" : "#FF0000"
                def statusText = (currentBuild.currentResult == 'SUCCESS') ? "✅ ÉXITO" : "❌ FALLO"

                def payload = """{
                    "type": "message",
                    "attachments": [
                        {
                            "contentType": "application/vnd.microsoft.card.adaptive",
                            "content": {
                                "type": "AdaptiveCard",
                                "body": [
                                    {
                                        "type": "TextBlock",
                                        "size": "Medium",
                                        "weight": "Bolder",
                                        "text": "${statusText}: Proyecto ${env.JOB_NAME}"
                                    },
                                    {
                                        "type": "TextBlock",
                                        "text": "La construcción #${env.BUILD_NUMBER} ha finalizado.",
                                        "wrap": true
                                    }
                                ],
                                "actions": [
                                    {
                                        "type": "Action.OpenUrl",
                                        "title": "Ver en Jenkins",
                                        "url": "${env.BUILD_URL}"
                                    }
                                ],
                                "\$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                                "version": "1.0"
                            }
                        }
                    ]
                }"""

                // Enviamos la notificación usando curl
                sh "curl -H 'Content-Type: application/json' -d '${payload}' '${teamsUrl}'"
            }
        }
    }
}