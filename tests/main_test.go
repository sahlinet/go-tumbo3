package main

import (
	"fmt"
	"strings"
	"testing"
	"time"

	http_helper "github.com/gruntwork-io/terratest/modules/http-helper"
	"github.com/gruntwork-io/terratest/modules/k8s"
	"github.com/gruntwork-io/terratest/modules/random"
)

func TestKubernetesHelloWorldExample(t *testing.T) {
	t.Parallel()

	nameSuffix := strings.ToLower(random.UniqueId())
	namespaceName := "tumbo-test-" + nameSuffix
	kubeResourcePath := "../deployments/test"

	options := k8s.NewKubectlOptions("", "", namespaceName)

	_, err := k8s.GetNamespaceE(t, options, namespaceName)
	if err != nil {
		k8s.CreateNamespace(t, options, namespaceName)
	}

	defer k8s.KubectlDelete(t, options, kubeResourcePath)
	k8s.KubectlApply(t, options, kubeResourcePath)

	serviceName := "tumbo-server-service"
	k8s.WaitUntilServiceAvailable(t, options, serviceName, 10, 1*time.Second)

	service := k8s.GetService(t, options, serviceName)
	url := fmt.Sprintf("http://%s", k8s.GetServiceEndpoint(t, options, service, 8000))

	http_helper.HttpGetWithRetry(t, url, nil, 200, "Tumbo", 30, 3*time.Second)
}
