package integrationtests

import (
	"fmt"
	"strings"
	"testing"
	"time"

	http_helper "github.com/gruntwork-io/terratest/modules/http-helper"
	"github.com/gruntwork-io/terratest/modules/k8s"
	"github.com/gruntwork-io/terratest/modules/random"
	"github.com/stretchr/testify/assert"
)

func TestKubernetesDeployment(t *testing.T) {
	t.Parallel()

	nameSuffix := strings.ToLower(random.UniqueId())
	namespaceName := "tumbo-test-" + nameSuffix
	kubeResourcePath := "../deployments/test"

	options := k8s.NewKubectlOptions("", "", namespaceName)

	_, err := k8s.GetNamespaceE(t, options, namespaceName)
	if err != nil {
		k8s.CreateNamespace(t, options, namespaceName)
	}

	defer k8s.DeleteNamespace(t, options, namespaceName)
	defer k8s.KubectlDelete(t, options, kubeResourcePath)
	k8s.KubectlApply(t, options, kubeResourcePath)

	serviceName := "tumbo-server-service"
	k8s.WaitUntilServiceAvailable(t, options, serviceName, 30, 1*time.Second)

	time.Sleep(20 * time.Second)
	tunnel := k8s.NewTunnel(options, k8s.ResourceTypeService, serviceName, 8000, 8000)
	err = tunnel.ForwardPortE(t)
	if err != nil {
		t.Error(err)
	}
	url := fmt.Sprintf("http://localhost:%s/", "8000")

	err = http_helper.HttpGetWithRetryWithCustomValidationE(t, url, nil, 20, 2*time.Second, func(statusCode int, body string) bool {
		return strings.Contains(body, "Tumbo")
	})
	assert.Nil(t, err)

}
