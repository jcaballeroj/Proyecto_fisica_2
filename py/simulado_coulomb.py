import tkinter as tk
from tkinter import messagebox
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from matplotlib.patches import Circle

# Crear ventana principal
ventana = tk.Tk()
ventana.title("Calculadora de la Ley de Coulomb")
ventana.geometry("1200x800")  # Aumentar el tamaño de la ventana

# Crear un Frame para el plano cartesiano
frame_trabajo = tk.Frame(ventana)
frame_trabajo.pack(side=tk.TOP, fill=tk.BOTH, expand=True)

# Crear un Frame para los datos de entrada
frame_datos = tk.Frame(ventana)
frame_datos.pack(side=tk.BOTTOM, fill=tk.X)

# Configurar la fuente
font = ("Helvetica", 16)

# Cuadros de texto para ingresar los valores de las cargas en el Frame inferior
label_q1 = tk.Label(frame_datos, text="Carga q1 (C):", font=font)
label_q1.pack(side=tk.LEFT, padx=10, pady=10)

entry_q1 = tk.Entry(frame_datos, width=10, font=font)
entry_q1.pack(side=tk.LEFT, padx=10, pady=10)
entry_q1.insert(0, "1.0")  # Valor inicial de q1

label_q2 = tk.Label(frame_datos, text="Carga q2 (C):", font=font)
label_q2.pack(side=tk.LEFT, padx=10, pady=10)

entry_q2 = tk.Entry(frame_datos, width=10, font=font)
entry_q2.pack(side=tk.LEFT, padx=10, pady=10)
entry_q2.insert(0, "1.0")  # Valor inicial de q2

label_distancia = tk.Label(frame_datos, text="Distancia (m):", font=font)
label_distancia.pack(side=tk.LEFT, padx=10, pady=10)

entry_distancia = tk.Entry(frame_datos, width=15, font=font)
entry_distancia.pack(side=tk.LEFT, padx=10, pady=10)

label_resultado = tk.Label(frame_datos, text="Fuerza (N):", font=font)
label_resultado.pack(side=tk.LEFT, padx=10, pady=10)

entry_resultado = tk.Entry(frame_datos, width=15, font=font)
entry_resultado.pack(side=tk.LEFT, padx=10, pady=10)

# Crear figura de matplotlib para el plano cartesiano
fig, ax = plt.subplots()
ax.set_xlim(-50, 50)
ax.set_ylim(-50, 50)
ax.set_title("Plano Cartesiano de Cargas", fontsize=16)
ax.set_xlabel("X (m)", fontsize=14)
ax.set_ylabel("Y (m)", fontsize=14)
ax.grid(True)

# Inicializar las cargas en el plano
q1 = Circle((0, 0), 2, color='blue', picker=True, label='q1')
q2 = Circle((10, 0), 2, color='red', picker=True, label='q2')
ax.add_patch(q1)
ax.add_patch(q2)
ax.annotate('q1', (0, 0), textcoords="offset points", xytext=(0,10), ha='center', fontsize=14)
ax.annotate('q2', (10, 0), textcoords="offset points", xytext=(0,10), ha='center', fontsize=14)

picked_circle = None

# Función para calcular la fuerza y mostrar el resultado
def calcular_fuerza(q1_pos, q2_pos):
    try:
        q1_val = float(entry_q1.get())
        q2_val = float(entry_q2.get())

        # Ajustar colores de las cargas basadas en su signo
        q1.set_color('blue' if q1_val < 0 else 'red')
        q2.set_color('blue' if q2_val < 0 else 'red')

        r = ((q2_pos[0] - q1_pos[0])**2 + (q2_pos[1] - q1_pos[1])**2)**0.5
        entry_distancia.delete(0, tk.END)
        entry_distancia.insert(0, f"{r:.2f}")

        if r == 0:
            messagebox.showerror("Error", "La distancia no puede ser cero.")
            return
        
        k_e = 8.9875 * 10**9  # N·m²/C²
        fuerza = k_e * abs(q1_val * q2_val) / r**2
        entry_resultado.delete(0, tk.END)
        entry_resultado.insert(0, f"{fuerza:.2e} N")
    except ValueError:
        messagebox.showerror("Error", "Por favor, introduce valores numéricos válidos.")

# Función para actualizar la distancia basada en el valor ingresado
def actualizar_distancia_manual():
    try:
        distancia = float(entry_distancia.get())
        if distancia > 100 or distancia < -100:
            messagebox.showerror("Error", "La distancia debe estar dentro del rango de -100 a 100.")
            return
        
        q2_new_x = q1.center[0] + distancia
        if q2_new_x < -50 or q2_new_x > 50:
            messagebox.showerror("Error", "La carga se saldría del plano. Ajusta la distancia.")
            return
        
        q2.center = (q2_new_x, q1.center[1])
        actualizar_plano()
    except ValueError:
        messagebox.showerror("Error", "Por favor, introduce una distancia válida.")

def actualizar_cargas():
    calcular_fuerza(q1.center, q2.center)
    actualizar_plano()

# Funciones de eventos para arrastrar y soltar
def on_pick(event):
    global picked_circle
    if isinstance(event.artist, Circle):
        picked_circle = event.artist

def on_drag(event):
    if picked_circle is not None and event.xdata is not None and event.ydata is not None:
        picked_circle.center = (event.xdata, event.ydata)
        actualizar_plano()

def on_release(event):
    global picked_circle
    picked_circle = None

def actualizar_plano():
    ax.clear()
    ax.set_xlim(-50, 50)
    ax.set_ylim(-50, 50)
    ax.set_title("Plano Cartesiano de Cargas", fontsize=16)
    ax.set_xlabel("X (m)", fontsize=14)
    ax.set_ylabel("Y (m)", fontsize=14)
    ax.grid(True)
    ax.add_patch(q1)
    ax.add_patch(q2)
    ax.annotate('q1', q1.center, textcoords="offset points", xytext=(0,10), ha='center', fontsize=14)
    ax.annotate('q2', q2.center, textcoords="offset points", xytext=(0,10), ha='center', fontsize=14)
    calcular_fuerza(q1.center, q2.center)

    # Calcular y dibujar líneas de campo eléctrico
    x = np.linspace(-50, 50, 200)  # Reducción de la resolución para mayor eficiencia
    y = np.linspace(-50, 50, 200)
    X, Y = np.meshgrid(x, y)
    Ex, Ey = np.zeros_like(X), np.zeros_like(Y)

    q1_val = float(entry_q1.get())
    q2_val = float(entry_q2.get())

    def campo(q, r0, X, Y):
        den = ((X - r0[0])**2 + (Y - r0[1])**2)**1.5
        return q * (X - r0[0]) / den, q * (Y - r0[1]) / den

    ex1, ey1 = campo(q1_val, q1.center, X, Y)
    ex2, ey2 = campo(q2_val, q2.center, X, Y)

    Ex += ex1 + ex2
    Ey += ey1 + ey2

    ax.streamplot(X, Y, Ex, Ey, color='r', linewidth=1, density=1.5)  # Ajuste de densidad y grosor

    canvas.draw()

fig.canvas.mpl_connect('pick_event', on_pick)
fig.canvas.mpl_connect('motion_notify_event', on_drag)
fig.canvas.mpl_connect('button_release_event', on_release)

# Botón para actualizar las cargas
boton_actualizar_cargas = tk.Button(frame_datos, text="Actualizar Cargas", command=actualizar_cargas, font=font)
boton_actualizar_cargas.pack(side=tk.LEFT, padx=10, pady=10)

# Botón para actualizar la distancia
boton_actualizar_distancia = tk.Button(frame_datos, text="Actualizar Distancia", command=actualizar_distancia_manual, font=font)
boton_actualizar_distancia.pack(side=tk.LEFT, padx=10, pady=10)

# Integrar el gráfico de matplotlib en el Frame de trabajo
canvas = FigureCanvasTkAgg(fig, master=frame_trabajo)
canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)

# Ejecutar la aplicación
ventana.mainloop()