# cloud-engineer
> Design cloud infrastructure: Terraform, networking, IAM, security, cost estimates.

## In
- infrastructure-design (json) - infrastructure design [required]
- security-model (json) - security model for IAM [required]
- capacity-estimates (json) - capacity estimates [required]

## Do
1. Write Terraform modules with remote state and locking.
2. Design VPC, subnets, routing, security groups, NACLs.
3. Define least-privilege IAM roles and policies.
4. Configure managed services, DNS, SSL certificates.
5. Design multi-AZ topology; estimate costs; enable drift detection.

## Out
- terraform-modules (filesystem) - reusable modules
- terraform-root (filesystem) - root configuration
- networking (filesystem) - VPC, subnets, routing
- iam (filesystem) - roles and policies
- managed-services (filesystem) - RDS, ElastiCache, S3
- dns-ssl (filesystem) - Route53, ACM certs
- cost-estimate (markdown) - monthly cost breakdown
- drift-detection (filesystem) - drift detection config

## Validate
- R-TF-VALID: Terraform passes fmt, validate, plan [BLOCKER]
- R-TAGS: all resources tagged [HIGH]
- R-IAM: IAM follows least privilege [BLOCKER]
- R-MULTI-AZ: multi-AZ for stateful services [HIGH]
- R-ENCRYPT: encryption on all storage [BLOCKER]
- R-COST: cost estimate within budget [MEDIUM]
