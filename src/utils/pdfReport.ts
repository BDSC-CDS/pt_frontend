// utils/pdfService.ts
import jsPDF from 'jspdf';
import { Questions } from '~/utils/questions';

interface PDFConfig {
    margin: number;
    headerHeight: number;
    pageWidth: number;
    pageHeight: number;
}

interface ReportData {
    totalHighRiskAnswers: number;
    totalQuestionsAnswered: number;
    sectionsCompleted: string[];
    missingDataSections: string[];
    overallCompletionRate: string;
}

export class PDFReportService {
    private pdf: jsPDF;
    private config: PDFConfig;
    private cursorY: number;
    private pageNumber: number;

    constructor() {
        this.pdf = new jsPDF('p', 'mm', 'a4');
        this.config = {
            margin: 10,
            headerHeight: 20,
            pageWidth: this.pdf.internal.pageSize.getWidth(),
            pageHeight: this.pdf.internal.pageSize.getHeight()
        };
        this.cursorY = this.config.margin + this.config.headerHeight;
        this.pageNumber = 1;
    }

    async generateReport(
        replyName: string | undefined,
        questions: Questions,
        currentRisk: number,
        reportData: ReportData
    ): Promise<void> {
        // Add header to first page
        await this.addHeader(true);
        this.addFooter(replyName);

        // Add content sections
        this.addSummarySection(replyName, currentRisk, reportData);
        this.addQuestionsSection(questions);

        // Save the PDF
        const filename = this.generateFilename(replyName);
        this.pdf.save(filename);
    }

    private generateFilename(replyName: string | undefined): string {
        const projectName = replyName || "unknown_project";
        const safeProjectName = projectName.replace(/[^a-zA-Z0-9]/g, '_');
        const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        
        return `risk_assessment_report_${safeProjectName}_${date}.pdf`;
    }

    private async addHeader(firstPage: boolean = false): Promise<void> {
        if (!firstPage) return;

        const headerBgColor = this.getHeaderColor();
        this.pdf.setFillColor(headerBgColor);
        this.pdf.rect(0, 0, this.config.pageWidth, this.config.headerHeight, "F");

        await this.addLogo();
        this.addHeaderTitle();
    }

    private getHeaderColor(): string {
        const rootStyles = getComputedStyle(document.documentElement);
        return rootStyles.getPropertyValue('--header-bg-color').trim() || '#306278';
    }

    private async addLogo(): Promise<void> {
        try {
            const base64Logo = await this.fetchLogoAsBase64();
            const logoData = await this.calculateLogoDimensions(base64Logo);
            
            this.pdf.addImage(
                base64Logo,
                "PNG",
                this.config.margin,
                (this.config.headerHeight - logoData.height) / 2,
                logoData.width,
                logoData.height
            );
        } catch (error) {
            console.error('Error adding logo:', error);
        }
    }

    private async fetchLogoAsBase64(): Promise<string> {
        const response = await fetch("/logo.png");
        const blob = await response.blob();
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    private async calculateLogoDimensions(base64Logo: string): Promise<{ width: number; height: number }> {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const aspectRatio = img.naturalWidth / img.naturalHeight;
                const maxLogoHeight = this.config.headerHeight * 0.7;
                const maxLogoWidth = this.config.pageWidth * 0.3;
                
                let logoWidth, logoHeight;
                
                if (aspectRatio > 1) {
                    logoWidth = Math.min(maxLogoWidth, maxLogoHeight * aspectRatio);
                    logoHeight = logoWidth / aspectRatio;
                } else {
                    logoHeight = Math.min(maxLogoHeight, maxLogoWidth / aspectRatio);
                    logoWidth = logoHeight * aspectRatio;
                }
                
                const minSize = 8;
                if (logoWidth < minSize || logoHeight < minSize) {
                    if (aspectRatio > 1) {
                        logoWidth = minSize * aspectRatio;
                        logoHeight = minSize;
                    } else {
                        logoWidth = minSize;
                        logoHeight = minSize / aspectRatio;
                    }
                }
                
                resolve({ width: logoWidth, height: logoHeight });
            };
            img.src = base64Logo;
        });
    }

    private addHeaderTitle(): void {
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setFontSize(14);
        this.pdf.setTextColor("#FFFFFF");
        // Assume logo width is stored somewhere accessible
        this.pdf.text("Privacy Toolbox", this.config.margin + 50, this.config.headerHeight / 1.5);
    }

    private addFooter(replyName: string | undefined): void {
        this.pdf.setFont("helvetica", "italic");
        this.pdf.setFontSize(10);
        this.pdf.setTextColor("#000000");
        this.pdf.text(
            `Privacy Toolbox Questionnaire Report - Project: ${replyName || ""}`,
            this.config.margin,
            this.config.pageHeight - 10
        );
        this.pdf.text(
            `Page ${this.pageNumber}`,
            this.config.pageWidth - this.config.margin - 20,
            this.config.pageHeight - 10
        );
    }

    private addSummarySection(
        replyName: string | undefined,
        currentRisk: number,
        reportData: ReportData
    ): void {
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setFontSize(12);
        this.pdf.text("Summary", this.config.margin, this.cursorY);
        this.cursorY += 10;

        const riskLabel = this.calculateRiskLabel(currentRisk, reportData.totalHighRiskAnswers);
        const summaryContent = this.buildSummaryContent(replyName, currentRisk, reportData, riskLabel);

        this.addTextContent(summaryContent, riskLabel);
        this.cursorY += 10;
    }

    private calculateRiskLabel(currentRisk: number, totalHighRiskAnswers: number): { text: string; color: string } {
        if (totalHighRiskAnswers > 0) {
            return { text: "High Risk", color: "#e76f51" };
        } else if (currentRisk > 45) {
            return { text: "Medium Risk", color: "#e9c46a" };
        } else {
            return { text: "Low to Medium Risk", color: "#2a9d8f" };
        }
    }

    private buildSummaryContent(
        replyName: string | undefined,
        currentRisk: number,
        reportData: ReportData,
        riskLabel: { text: string; color: string }
    ): string[] {
        return [
            `Project Title: ${replyName || ""}`,
            `Total Questions Answered: ${reportData.totalQuestionsAnswered}`,
            `Sections Completed: ${reportData.sectionsCompleted.join(", ")}`,
            `Missing Data Sections: ${reportData.missingDataSections.length > 0
                ? reportData.missingDataSections.join(", ")
                : "None"}`,
            `Overall Completion Rate: ${reportData.overallCompletionRate}`,
            `Risk Score: ${currentRisk}`,
            `Total High Risk Answers: ${reportData.totalHighRiskAnswers}`,
            `Risk Level: ${riskLabel.text}`
        ];
    }

    private addTextContent(content: string[], riskLabel: { text: string; color: string }): void {
        content.forEach((line) => {
            this.checkPageBreak();
            
            if (line.startsWith("Risk Level:")) {
                this.setRiskColor(riskLabel.color);
            } else {
                this.pdf.setTextColor(0, 0, 0);
            }
            
            const wrappedLines = this.pdf.splitTextToSize(line, this.config.pageWidth - 2 * this.config.margin);
            this.pdf.text(wrappedLines, this.config.margin, this.cursorY);
            this.cursorY += wrappedLines.length * 6;
        });
        
        this.pdf.setTextColor(0, 0, 0);
    }

    private setRiskColor(color: string): void {
        this.pdf.setTextColor(
            parseInt(color.slice(1, 3), 16),
            parseInt(color.slice(3, 5), 16),
            parseInt(color.slice(5, 7), 16)
        );
    }

    private addQuestionsSection(questions: Questions): void {
        Object.keys(questions).forEach((tab) => {
            this.addTabSection(tab, questions[tab] || []);
        });
    }

    private addTabSection(tabName: string, tabQuestions: any[]): void {
        this.checkPageBreak(10);
        
        this.pdf.setFont("helvetica", "bold");
        this.pdf.setFontSize(14);
        this.pdf.text(`Tab: ${tabName}`, this.config.margin, this.cursorY);
        this.cursorY += 10;

        tabQuestions.forEach((question, questionIndex) => {
            this.addQuestion(question, questionIndex);
        });

        this.cursorY += 5;
    }

    private addQuestion(question: any, questionIndex: number): void {
        this.checkPageBreak(15);

        // Add question
        this.pdf.setFont("helvetica", "normal");
        this.pdf.setFontSize(12);
        const questionText = `${questionIndex + 1}. ${question.questionDescription}`;
        const questionLines = this.pdf.splitTextToSize(questionText, this.config.pageWidth - 2 * this.config.margin);
        this.pdf.text(questionLines, this.config.margin, this.cursorY);
        this.cursorY += questionLines.length * 6;

        // Add answer
        this.pdf.setFont("helvetica", "italic");
        const selectedAnswer = question.answers.find((a: any) => a.selected);
        const answerText = selectedAnswer
            ? `Answer: ${selectedAnswer.answerDescription}`
            : "Answer: Not Answered";
        const answerLines = this.pdf.splitTextToSize(answerText, this.config.pageWidth - 2 * this.config.margin);
        this.pdf.text(answerLines, this.config.margin + 10, this.cursorY);
        this.cursorY += answerLines.length * 6 + 5;
    }

    private checkPageBreak(requiredSpace: number = 0): void {
        if (this.cursorY + requiredSpace > this.config.pageHeight - this.config.margin) {
            this.pdf.addPage();
            this.cursorY = this.config.margin + this.config.headerHeight;
            this.pageNumber++;
            this.addFooter(""); // You might want to pass replyName here
        }
    }
}