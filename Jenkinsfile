node {
  stage('SCM') {
    checkout scm
  }
  stage('SonarQube Analysis') {
    def mvn = tool 'Maven_Jenkins';
    withSonarQubeEnv() {
      sh "${mvn}/bin/mvn clean verify sonar:sonar -Dsonar.projectKey=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"
    }
  }
}
