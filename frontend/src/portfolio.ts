// Toutes tes données portfolio sont ici. Édite ce fichier, pas le terminal.

export interface Profile {
  name: string
  role: string
  location: string
  tagline: string
  email: string
  github: string
  linkedin: string
}

export interface SkillGroup {
  group: string
  items: string[]
}

export interface Project {
  name: string
  desc: string
  stack: string[]
  url: string
}

export interface ExperienceItem {
  period: string
  title: string
  company: string
  desc: string
}

export const profile: Profile = {
  name: 'Kevin Di Nocera',
  role: 'DevOps Engineer / Platform Engineer',
  location: 'Suisse · Switzerland West',
  tagline: 'Infrastructure as code, automatisation et plateformes cloud.',
  email: 'kevin.dinocera@protonmail.com',
  github: 'https://github.com/0xCAF3D0OD',
  linkedin: 'https://www.linkedin.com/in/',
}

export const about: string[] = [
  "Ingénieur DevOps / Plateforme junior spécialisé dans l'Infrastructure as Code et " +
  "l'orchestration cloud. Compétences pratiques en Terraform, Ansible, Kubernetes, Helm, AWS, " +
  "Azure et CI/CD, acquises lors d'un stage chez NAGRA Kudelski et dans le cadre d'un projet personnel " +
  "déployé en production. Passionné par l'automatisation, l'évolutivité et les outils maison.",
]

export const skills: SkillGroup[] = [
  { group: 'Cloud', items: ['AWS', 'Azure', 'OpenStack'] },
  { group: 'IaC', items: ['Terraform', 'Ansible'] },
  { group: 'Conteneurs', items: ['Docker', 'Kubernetes K3s', 'Helm'] },
  { group: 'CI/CD', items: ['GitLab CI', 'GitHub Actions', 'ArgoCD'] },
  { group: 'Observabilité', items: ['Prometheus', 'Grafana'] },
  { group: 'Langages', items: ['Python', 'Bash', 'Typescript'] },
]

export const projects: Project[] = [
  {
    name: 'alloremplacant.ch / Educhat',
    desc:
      "Plateforme de mise en relation pour l'enseignement " +
      'obligatoire vaudois (DGEO) : les établissements publient des missions, ' +
      'les remplaçant·e·s les trouvent et y postulent.',
    stack: ['Terraform', 'Kubernetes K3s', 'Ansible', 'Docker', 'GitHub actions', 'Helm', 'Azure'],
    url: 'https://github.com/0xCAF3D0OD/Educhat',
  },
  {
    name: 'Terraform-oci',
    desc:
      "Ce projet introduit l'utilisation de la Cli d'oci qui sert à configurer son propre compte " +
      "il contient la configuration pour la mise en place d'une infrastructure Oracle Cloud Infrastructure " +
      '(OCI) sécurisée avec Terraform, suivant le principe du Moindre Privilège.',
    stack: ['OCI', 'python', 'terraform'],
    url: 'https://github.com/0xCAF3D0OD/terraform-oci',
  },
  {
    name: 'Cloud-1',
    desc:
      "Ce projet consiste à automatiser le déploiement d'un serveur web complet, exécutant " +
      'simultanément WordPress, PHPMyAdmin et une base de données via des conteneurs Docker ' +
      "individuels, tout en utilisant Ansible pourl'automatisation.",
    stack: ['Ansible', 'Azure vm', 'Docker', 'Terraform'],
    url: 'https://github.com/0xCAF3D0OD/ansible-azure',
  },
  {
    name: 'Inception-of-Things',
    desc:
      "Ce projet introduit l'utilisation de K3d et K3s avec Vagrant pour configurer une machine " +
      "virtuelle personnelle, explorer K3s et ses Ingress, et découvrir K3d, simplifiant l'accès " +
      'à Kubernetes.',
    stack: ['Kubernetes', 'Vagrant', 'ArgoCD'],
    url: 'https://github.com/0xCAF3D0OD/42Inception-of-Things',
  },
]

export const experience: ExperienceItem[] = [
  {
    period: '15.11.2024 — 15.11.2025',
    title: 'DevOps / Platform Engineer stage',
    company: 'NAGRA Kudelski Group',
    desc:
      "Création d'un portail de monitoring pour centraliser la supervision des projets GitLab " +
      "de l'équipe SRE.\n" +
      "Résultat : Réduction du temps d'analyse des projets par l'équipe SRE de 1-3 min à 2-5 secondes.",
  },
  {
    period: '2021 — 2023',
    title: 'Ingénieur Systèmes',
    company: 'Entreprise',
    desc: 'Administration cloud, scripting et CI/CD.',
  },
]
