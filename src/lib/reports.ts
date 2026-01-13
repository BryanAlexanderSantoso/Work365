import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportData {
    fullName: string;
    workouts: any[];
    runs: any[];
    nutrition: any[];
    type: "Harian" | "Mingguan" | "Bulanan" | "Tahunan";
    dateRange: string;
}

export const generatePDFReport = (data: ReportData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Primary Colors (Work365 Red)
    const primaryRed: [number, number, number] = [239, 68, 68];

    // Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryRed[0], primaryRed[1], primaryRed[2]);
    doc.text("WORK365 PROGRESS REPORT", 105, 25, { align: "center" });

    // Subtitle
    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text(`Laporan ${data.type} - ${data.dateRange}`, 105, 35, { align: "center" });

    // Meta Info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.text(`Member: ${data.fullName}`, 20, 50);
    doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString("id-ID")}`, 20, 55);

    let currentY = 70;

    // Workouts Section
    if (data.workouts && data.workouts.length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Ringkasan Latihan", 20, currentY);
        currentY += 10;

        const workoutRows = data.workouts.map(w => [
            new Date(w.created_at).toLocaleDateString("id-ID"),
            w.exercise_name || "Latihan",
            `${w.sets || 0}`,
            `${w.reps || 0}`,
            `${w.weight_kg || 0} kg`,
            w.notes || "-"
        ]);

        autoTable(doc, {
            startY: currentY,
            head: [["Tanggal", "Latihan", "Sets", "Reps", "Beban", "Catatan"]],
            body: workoutRows,
            theme: "striped",
            headStyles: { fillColor: primaryRed, textColor: 255 },
            alternateRowStyles: { fillColor: [254, 242, 242] },
        });
        currentY = (doc as any).lastAutoTable.finalY + 20;
    }

    // Runs Section
    if (data.runs && data.runs.length > 0) {
        if (currentY > 230) {
            doc.addPage();
            currentY = 20;
        }

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Aktivitas Lari", 20, currentY);
        currentY += 10;

        const runRows = data.runs.map(r => [
            new Date(r.created_at).toLocaleDateString("id-ID"),
            `${r.distance || 0} km`,
            r.duration || "-",
            r.pace || "-",
            `${r.calories_burned || 0} kkal`
        ]);

        autoTable(doc, {
            startY: currentY,
            head: [["Tanggal", "Jarak", "Durasi", "Pace", "Kalori"]],
            body: runRows,
            theme: "striped",
            headStyles: { fillColor: [59, 130, 246], textColor: 255 }, // Blue 500 for runs
        });
        currentY = (doc as any).lastAutoTable.finalY + 20;
    }

    // Nutrition Section
    if (data.nutrition && data.nutrition.length > 0) {
        if (currentY > 230) {
            doc.addPage();
            currentY = 20;
        }

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Catatan Nutrisi", 20, currentY);
        currentY += 10;

        const nutritionRows = data.nutrition.map(n => [
            new Date(n.created_at).toLocaleDateString("id-ID"),
            n.food_name || "Makanan",
            `${n.calories || 0} kcal`,
            `${n.protein || 0}g`,
            `${n.carbs || 0}g`,
            `${n.fat || 0}g`
        ]);

        autoTable(doc, {
            startY: currentY,
            head: [["Tanggal", "Makanan", "Kalori", "Protein", "Karb", "Lemak"]],
            body: nutritionRows,
            theme: "striped",
            headStyles: { fillColor: [249, 115, 22], textColor: 255 }, // Orange 500 for nutrition
        });
        currentY = (doc as any).lastAutoTable.finalY + 20;
    }

    // Footer
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
            `Halaman ${i} dari ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: "center" }
        );
        doc.text("Work365 - Your 365-Day Transformation Partner", 20, doc.internal.pageSize.getHeight() - 10);
    }

    // Save the PDF
    const filename = `Work365_Laporan_${data.type}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
};
