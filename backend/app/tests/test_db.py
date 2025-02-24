import pymysql

try:
    conn = pymysql.connect(
        host="localhost",
        user="root",
        password="",
        database="estancia_nazario",
        port=3306
    )
    print("✅ Conexión exitosa a MySQL")
    conn.close()
except Exception as e:
    print(f"❌ Error en la conexión: {e}")
