# Runbook: {{PROJECT_NAME}}

> **Version:** {{VERSION}}  
> **Last Updated:** {{DATE}}  
> **Owner:** {{TEAM}}  
> **On-Call:** {{ONCALL_ROTATION}}

---

## 1. Service Overview

| Attribute | Value |
|-----------|-------|
| **Service Name** | {{SERVICE_NAME}} |
| **Description** | {{SERVICE_DESCRIPTION}} |
| **Repository** | {{REPO_URL}} |
| **Documentation** | {{DOCS_URL}} |
| **Dashboard** | {{DASHBOARD_URL}} |
| **Alerts** | {{ALERTS_URL}} |
| **Logs** | {{LOGS_URL}} |
| **Traces** | {{TRACES_URL}} |
| **Dependencies** | {{DEPENDENCIES}} |

### 1.1 Architecture Summary
{{ARCHITECTURE_SUMMARY}}

### 1.2 Critical User Flows
1. **{{FLOW_1}}** — {{FLOW_1_DESC}} — SLA: {{FLOW_1_SLA}}
2. **{{FLOW_2}}** — {{FLOW_2_DESC}} — SLA: {{FLOW_2_SLA}}
3. **{{FLOW_3}}** — {{FLOW_3_DESC}} — SLA: {{FLOW_3_SLA}}

---

## 2. Service Level Objectives (SLOs)

| SLI | Target | Measurement Window | Alert Threshold |
|-----|--------|-------------------|-----------------|
| Availability | {{AVAILABILITY_TARGET}}% | {{WINDOW}} | <{{AVAILABILITY_ALERT}}% |
| Latency (p99) | <{{LATENCY_P99}}ms | {{WINDOW}} | >{{LATENCY_ALERT}}ms |
| Error Rate | <{{ERROR_RATE_TARGET}}% | {{WINDOW}} | >{{ERROR_RATE_ALERT}}% |
| Throughput | >{{THROUGHPUT_TARGET}} req/s | {{WINDOW}} | <{{THROUGHPUT_ALERT}} req/s |

### 2.1 Error Budget Policy
- **Burn Rate Alert:** 2% budget consumed in 1h → Page
- **Burn Rate Alert:** 5% budget consumed in 6h → Page
- **Burn Rate Alert:** 10% budget consumed in 24h → Ticket

---

## 3. Monitoring & Alerting

### 3.1 Key Dashboards
| Dashboard | Purpose | Link |
|-----------|---------|------|
| {{DASH_1}} | {{DASH_1_PURPOSE}} | {{DASH_1_URL}} |
| {{DASH_2}} | {{DASH_2_PURPOSE}} | {{DASH_2_URL}} |

### 3.2 Critical Alerts
| Alert | Severity | Condition | Runbook Section |
|-------|----------|-----------|-----------------|
| {{ALERT_1}} | {{SEV_1}} | {{COND_1}} | {{SECTION_1}} |
| {{ALERT_2}} | {{SEV_2}} | {{COND_2}} | {{SECTION_2}} |

### 3.3 Alert Routing
```
{{ALERT_ROUTING}}
```

---

## 4. Common Operations

### 4.1 Deploy New Version
```bash
# 1. Verify image exists
docker pull {{REGISTRY}}/{{IMAGE_NAME}}:{{VERSION}}

# 2. Deploy to staging
kubectl set image deployment/{{DEPLOYMENT_NAME}} \
  {{CONTAINER_NAME}}={{REGISTRY}}/{{IMAGE_NAME}}:{{VERSION}} \
  -n {{NAMESPACE}}

# 3. Verify rollout
kubectl rollout status deployment/{{DEPLOYMENT_NAME}} -n {{NAMESPACE}}

# 4. Run smoke tests
{{SMOKE_TEST_CMD}}

# 5. Promote to production (if staging healthy)
kubectl apply -k overlays/production
```

### 4.2 Rollback
```bash
# Option 1: Rollback deployment (last 10 revisions kept)
kubectl rollout undo deployment/{{DEPLOYMENT_NAME}} -n {{NAMESPACE}}

# Option 2: Rollback to specific revision
kubectl rollout undo deployment/{{DEPLOYMENT_NAME}} \
  --to-revision={{REVISION}} -n {{NAMESPACE}}

# Option 3: Deploy previous known-good image
kubectl set image deployment/{{DEPLOYMENT_NAME}} \
  {{CONTAINER_NAME}}={{REGISTRY}}/{{IMAGE_NAME}}:{{PREVIOUS_VERSION}} \
  -n {{NAMESPACE}}

# Verify
kubectl rollout status deployment/{{DEPLOYMENT_NAME}} -n {{NAMESPACE}}
```

### 4.3 Scale Manually
```bash
# Scale up
kubectl scale deployment/{{DEPLOYMENT_NAME}} \
  --replicas={{DESIRED_REPLICAS}} -n {{NAMESPACE}}

# Scale down (respect PDB)
kubectl scale deployment/{{DEPLOYMENT_NAME}} \
  --replicas={{MIN_REPLICAS}} -n {{NAMESPACE}}

# Check HPA status
kubectl get hpa {{HPA_NAME}} -n {{NAMESPACE}}
```

### 4.4 Restart Pods
```bash
# Rolling restart (zero-downtime)
kubectl rollout restart deployment/{{DEPLOYMENT_NAME}} -n {{NAMESPACE}}

# Force restart specific pod
kubectl delete pod {{POD_NAME}} -n {{NAMESPACE}}
```

### 4.5 Database Operations
```bash
# Run migrations
kubectl exec -it {{MIGRATION_POD}} -n {{NAMESPACE}} -- {{MIGRATE_CMD}}

# Backup database
{{BACKUP_CMD}}

# Restore database
{{RESTORE_CMD}}

# Check replication lag
{{REPLICATION_LAG_CMD}}
```

### 4.6 Clear Cache
```bash
# Redis cache
kubectl exec -it {{REDIS_POD}} -n {{NAMESPACE}} -- redis-cli FLUSHDB

# Application cache (if applicable)
kubectl exec -it {{APP_POD}} -n {{NAMESPACE}} -- {{CLEAR_CACHE_CMD}}
```

---

## 5. Incident Response Procedures

### 5.1 High Latency / Timeouts
**Symptoms:** p99 latency > {{LATENCY_ALERT}}ms, increased timeout errors

**Diagnosis:**
```bash
# 1. Check current metrics
{{CHECK_LATENCY_CMD}}

# 2. Check resource utilization
kubectl top pods -n {{NAMESPACE}} -l app={{APP_LABEL}}

# 3. Check database connections
{{CHECK_DB_CONNECTIONS_CMD}}

# 4. Check for slow queries
{{CHECK_SLOW_QUERIES_CMD}}

# 5. Check external dependencies
{{CHECK_DEPENDENCIES_CMD}}
```

**Remediation:**
| Cause | Action |
|-------|--------|
| CPU saturation | Scale up deployment, optimize hot paths |
| Memory pressure | Increase limits, fix memory leaks |
| DB connection pool exhaustion | Increase pool size, fix connection leaks |
| Slow queries | Add indexes, optimize queries, enable query cache |
| Downstream latency | Circuit breaker, fallback, cache |
| GC pauses | Tune GC, upgrade runtime |

### 5.2 High Error Rate
**Symptoms:** Error rate > {{ERROR_RATE_ALERT}}%, 5xx responses increasing

**Diagnosis:**
```bash
# 1. Check error breakdown
{{CHECK_ERRORS_CMD}}

# 2. Check recent deployments
kubectl rollout history deployment/{{DEPLOYMENT_NAME}} -n {{NAMESPACE}}

# 3. Check logs for patterns
{{CHECK_LOGS_CMD}}

# 4. Check dependency health
{{CHECK_DEPENDENCIES_CMD}}
```

**Remediation:**
| Error Type | Action |
|------------|--------|
| 500 (Internal) | Rollback if recent deploy, check logs for stack trace |
| 502/503 (Bad Gateway) | Check upstream services, restart pods |
| 504 (Gateway Timeout) | Increase timeouts, check downstream latency |
| 4xx spikes | Check client changes, validate input sanitization |

### 5.3 Service Unavailable / CrashLoopBackOff
**Symptoms:** Pods not ready, CrashLoopBackOff, 0/1 ready

**Diagnosis:**
```bash
# 1. Check pod status
kubectl get pods -n {{NAMESPACE}} -l app={{APP_LABEL}}

# 2. Check logs
kubectl logs {{POD_NAME}} -n {{NAMESPACE}} --previous

# 3. Check events
kubectl describe pod {{POD_NAME}} -n {{NAMESPACE}}

# 4. Check resource limits
kubectl describe pod {{POD_NAME}} -n {{NAMESPACE}} | grep -A 10 Limits
```

**Remediation:**
| Cause | Action |
|-------|--------|
| OOMKilled | Increase memory limit, fix memory leak |
| Config error | Fix ConfigMap/Secret, restart |
| Migration failure | Check migration logs, run manually |
| Dependency unavailable | Wait for dependency, add retry logic |
| Port conflict | Check service ports, fix configuration |

### 5.4 Database Issues
**Symptoms:** Connection errors, slow queries, replication lag

**Diagnosis:**
```bash
# 1. Check connections
{{CHECK_DB_CONNECTIONS_CMD}}

# 2. Check replication
{{CHECK_REPLICATION_CMD}}

# 3. Check disk space
{{CHECK_DISK_SPACE_CMD}}

# 4. Check locks
{{CHECK_LOCKS_CMD}}
```

**Remediation:**
| Issue | Action |
|-------|--------|
| Too many connections | Increase max_connections, fix connection leaks |
| Replication lag | Pause writes, investigate slow replica |
| Disk full | Cleanup logs, increase volume, archive old data |
| Deadlocks | Analyze queries, add indexes, retry logic |

### 5.5 Security Incident
**Symptoms:** Unauthorized access, suspicious activity, data breach indicators

**Immediate Actions:**
1. **Isolate:** Block suspicious IPs at WAF/Load Balancer
2. **Revoke:** Rotate compromised credentials (API keys, DB passwords, JWT secrets)
3. **Audit:** Check audit logs for scope of access
4. **Notify:** Security team, legal, compliance per policy
5. **Preserve:** Snapshot affected systems for forensics

**Runbook:** {{SECURITY_INCIDENT_RUNBOOK_URL}}

---

## 6. Disaster Recovery

### 6.1 Regional Failover
**RTO:** {{RTO}} | **RPO:** {{RPO}}

```bash
# 1. Verify DR region health
{{CHECK_DR_HEALTH_CMD}}

# 2. Update DNS / Global Load Balancer
{{UPDATE_DNS_CMD}}

# 3. Promote DR database
{{PROMOTE_DR_DB_CMD}}

# 4. Scale up DR deployment
kubectl scale deployment/{{DEPLOYMENT_NAME}} \
  --replicas={{DR_REPLICAS}} -n {{NAMESPACE}} \
  --context={{DR_CONTEXT}}

# 5. Verify service health
{{VERIFY_HEALTH_CMD}}
```

### 6.2 Data Recovery
```bash
# Point-in-time recovery
{{PITR_CMD}}

# Restore from backup
{{RESTORE_BACKUP_CMD}}

# Verify data integrity
{{VERIFY_DATA_CMD}}
```

### 6.3 Complete Rebuild
```bash
# 1. Provision infrastructure
terraform apply -var="environment=production"

# 2. Deploy applications
kubectl apply -k overlays/production

# 3. Restore data
{{RESTORE_DATA_CMD}}

# 4. Run smoke tests
{{SMOKE_TEST_CMD}}

# 5. Switch traffic
{{SWITCH_TRAFFIC_CMD}}
```

---

## 7. Maintenance Windows

| Window | Frequency | Duration | Activities |
|--------|-----------|----------|------------|
| {{WINDOW_1}} | {{FREQ_1}} | {{DUR_1}} | {{ACT_1}} |
| {{WINDOW_2}} | {{FREQ_2}} | {{DUR_2}} | {{ACT_2}} |

### 7.1 Pre-Maintenance Checklist
- [ ] Notify stakeholders ({{NOTICE_PERIOD}})
- [ ] Verify error budget available
- [ ] Confirm on-call coverage
- [ ] Prepare rollback plan
- [ ] Schedule in change calendar

### 7.2 Post-Maintenance Verification
- [ ] All pods healthy
- [ ] Smoke tests pass
- [ ] Metrics within SLO
- [ ] No new alerts firing
- [ ] Update change record

---

## 8. Capacity Planning

### 8.1 Current Capacity
| Resource | Current Usage | Limit | Headroom | Trend |
|----------|---------------|-------|----------|-------|
| CPU | {{CPU_USAGE}}% | {{CPU_LIMIT}}% | {{CPU_HEADROOM}}% | {{CPU_TREND}} |
| Memory | {{MEM_USAGE}}% | {{MEM_LIMIT}}% | {{MEM_HEADROOM}}% | {{MEM_TREND}} |
| Disk | {{DISK_USAGE}}% | {{DISK_LIMIT}}% | {{DISK_HEADROOM}}% | {{DISK_TREND}} |
| Network | {{NET_USAGE}}% | {{NET_LIMIT}}% | {{NET_HEADROOM}}% | {{NET_TREND}} |
| DB Connections | {{DB_CONN_USAGE}} | {{DB_CONN_LIMIT}} | {{DB_CONN_HEADROOM}} | {{DB_CONN_TREND}} |

### 8.2 Scaling Triggers
| Metric | Threshold | Action |
|--------|-----------|--------|
| CPU > {{CPU_SCALE_THRESHOLD}}% for 5m | Scale up |
| Memory > {{MEM_SCALE_THRESHOLD}}% for 5m | Scale up |
| Request queue > {{QUEUE_THRESHOLD}} | Scale up |
| p99 latency > {{LATENCY_SCALE_THRESHOLD}}ms | Scale up |

### 8.3 Projected Growth
| Period | Expected Load | Required Capacity | Action Needed |
|--------|---------------|-------------------|---------------|
| 3 months | {{LOAD_3M}} | {{CAP_3M}} | {{ACTION_3M}} |
| 6 months | {{LOAD_6M}} | {{CAP_6M}} | {{ACTION_6M}} |
| 12 months | {{LOAD_12M}} | {{CAP_12M}} | {{ACTION_12M}} |

---

## 9. Useful Commands Reference

```bash
# Get service status
kubectl get all -n {{NAMESPACE}} -l app={{APP_LABEL}}

# View logs (follow)
kubectl logs -f deployment/{{DEPLOYMENT_NAME}} -n {{NAMESPACE}} -c {{CONTAINER_NAME}}

# Execute into pod
kubectl exec -it {{POD_NAME}} -n {{NAMESPACE}} -c {{CONTAINER_NAME}} -- /bin/sh

# Port forward
kubectl port-forward svc/{{SERVICE_NAME}} {{LOCAL_PORT}}:{{REMOTE_PORT}} -n {{NAMESPACE}}

# Check resource usage
kubectl top pods -n {{NAMESPACE}} --sort-by=memory

# View events
kubectl get events -n {{NAMESPACE}} --sort-by='.lastTimestamp'

# Check config
kubectl get configmap {{CONFIGMAP_NAME}} -n {{NAMESPACE}} -o yaml

# Check secrets (metadata only)
kubectl get secret {{SECRET_NAME}} -n {{NAMESPACE}} -o yaml

# Describe deployment
kubectl describe deployment {{DEPLOYMENT_NAME}} -n {{NAMESPACE}}

# Check HPA
kubectl get hpa {{HPA_NAME}} -n {{NAMESPACE}} -o yaml

# Check PDB
kubectl get pdb {{PDB_NAME}} -n {{NAMESPACE}} -o yaml
```

---

## 10. Contacts & Escalation

| Role | Name | Contact | Backup |
|------|------|---------|--------|
| Primary On-Call | {{PRIMARY_ONCALL}} | {{PRIMARY_CONTACT}} | {{PRIMARY_BACKUP}} |
| Secondary On-Call | {{SECONDARY_ONCALL}} | {{SECONDARY_CONTACT}} | {{SECONDARY_BACKUP}} |
| Team Lead | {{TEAM_LEAD}} | {{LEAD_CONTACT}} | |
| Engineering Manager | {{ENG_MANAGER}} | {{EM_CONTACT}} | |
| Security Team | {{SEC_TEAM}} | {{SEC_CONTACT}} | |
| Infrastructure Team | {{INFRA_TEAM}} | {{INFRA_CONTACT}} | |

### Escalation Policy
1. **Page Primary On-Call** — Acknowledgment within 5 min
2. **Escalate to Secondary** — If no ack in 10 min
3. **Escalate to Team Lead** — If no resolution in 30 min
4. **Escalate to Engineering Manager** — If no resolution in 1 hour
5. **Incident Commander** — For SEV-1/SEV-2 incidents

---

## 11. Related Documentation

| Document | Link |
|----------|------|
| Architecture Decision Records | {{ADR_URL}} |
| API Documentation | {{API_DOCS_URL}} |
| Database Schema | {{DB_SCHEMA_URL}} |
| Deployment Guide | {{DEPLOY_GUIDE_URL}} |
| Security Policy | {{SEC_POLICY_URL}} |
| Incident Retrospectives | {{RETROSPECTIVES_URL}} |

---

## 12. Change Log

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| {{DATE}} | {{VERSION}} | {{AUTHOR}} | Initial version |

---

*This runbook should be reviewed and updated after every incident and major change.*