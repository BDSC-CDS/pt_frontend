{{/*
Expand the name of the chart.
*/}}
{{- define "pt-frontend.name" -}}
{{- $name := .Values.nameOverride | default .Chart.Name -}}
{{- $name | trunc 63 | trimSuffix "-" -}}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "pt-frontend.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "pt-frontend.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "pt-frontend.labels" -}}
chart: {{ include "pt-frontend.chart" . }}
{{ include "pt-frontend.selectorLabels" . }}
{{- if .Chart.AppVersion }}
appVersion: {{ .Chart.AppVersion | quote }}
{{- end }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "pt-frontend.selectorLabels" -}}
app: {{ include "pt-frontend.name" . }}
release: {{ .Release.Name }}
{{- end }}