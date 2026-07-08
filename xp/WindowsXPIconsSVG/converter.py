import os
import sys

# Évite le plantage lié à Fontconfig en forçant un environnement vide si besoin
os.environ["FONTCONFIG_FILE"] = "/dev/null"

try:
    from psd2svg import convert
except ImportError:
    print("❌ Erreur : psd2svg n'est pas installé dans ce .venv.")
    print("Exécutez : pip install psd2svg")
    sys.exit(1)

# Dossier contenant vos icônes Windows XP
target_dir = "."

print("🚀 Démarrage de la conversion par lot...")

# Compteurs pour le suivi
success_count = 0
error_count = 0

for filename in os.listdir(target_dir):
    if filename.lower().endswith('.psd'):
        input_path = os.path.join(target_dir, filename)
        
        # Génère le nom de sortie .svg dans le même dossier
        base_name = os.path.splitext(filename)[0]
        output_path = os.path.join(target_dir, f"{base_name}.svg")
        
        try:
            # Conversion individuelle du fichier
            convert(input_path, output_path)
            print(f"✅ Converti : {filename} -> {base_name}.svg")
            success_count += 1
        except Exception as e:
            print(f"❌ Erreur sur {filename} : {e}")
            error_count += 1

print(f"\n✨ Traitement terminé ! Réussis : {success_count} | Échecs : {error_count}")

