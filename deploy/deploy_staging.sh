#!/bin/bash
kubectl config set-cluster hrv-cluster01 --server="$STAGING_KUBE_URL" --insecure-skip-tls-verify=true
kubectl config set-credentials deploy --token="$STAGING_KUBE_TOKEN"
kubectl config set-context default --cluster=hrv-cluster01 --user=deploy
kubectl config use-context default


deploy()
{
  helm fetch \
  --repo http://35.185.184.111:8000/kube-template \
  --untar \
  --untardir ./chart $1
  helm template --set CI_JOB_ID=$CI_JOB_ID --values ./deploy/values_staging.yml ./chart/$1 > kubernetes.yml
  kubectl apply -f kubernetes.yml
}

deploy 'onapp'
