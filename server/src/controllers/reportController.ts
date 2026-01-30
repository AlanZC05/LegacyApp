import { Response } from 'express';
import { Task, Project, User } from '../models';
import { AuthRequest } from '../middleware/auth';

/**
 * Controlador de Reportes
 * Genera reportes y exporta datos
 */

/**
 * @route   GET /api/reports/tasks
 * @desc    Generar reporte de tareas por estado
 * @access  Private
 */
export const generateTaskReport = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const tasks = await Task.find();

        // Agrupar por estado
        const statusCount: { [key: string]: number } = {};
        tasks.forEach(task => {
            const status = task.status || 'Pendiente';
            statusCount[status] = (statusCount[status] || 0) + 1;
        });

        res.json({
            success: true,
            data: statusCount
        });
    } catch (error) {
        console.error('Error al generar reporte:', error);
        res.status(500).json({
            success: false,
            message: 'Error al generar reporte'
        });
    }
};

/**
 * @route   GET /api/reports/projects
 * @desc    Generar reporte de tareas por proyecto
 * @access  Private
 */
export const generateProjectReport = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const projects = await Project.find();
        const tasks = await Task.find();

        const report = projects.map(project => ({
            projectId: project._id,
            projectName: project.name,
            taskCount: tasks.filter(t => t.projectId?.toString() === project._id.toString()).length
        }));

        res.json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Error al generar reporte:', error);
        res.status(500).json({
            success: false,
            message: 'Error al generar reporte'
        });
    }
};

/**
 * @route   GET /api/reports/users
 * @desc    Generar reporte de tareas por usuario
 * @access  Private
 */
export const generateUserReport = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const users = await User.find().select('-password');
        const tasks = await Task.find();

        const report = users.map(user => ({
            userId: user._id,
            username: user.username,
            assignedTasks: tasks.filter(t => t.assignedTo?.toString() === user._id.toString()).length
        }));

        res.json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Error al generar reporte:', error);
        res.status(500).json({
            success: false,
            message: 'Error al generar reporte'
        });
    }
};

/**
 * @route   GET /api/reports/export-csv
 * @desc    Exportar tareas a CSV
 * @access  Private
 */
export const exportCSV = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const tasks = await Task.find()
            .populate('projectId', 'name')
            .populate('assignedTo', 'username');

        // Generar CSV
        let csv = 'ID,Título,Estado,Prioridad,Proyecto,Asignado,Fecha Vencimiento\n';

        tasks.forEach(task => {
            const projectName = (task.projectId as any)?.name || 'Sin proyecto';
            const assignedName = (task.assignedTo as any)?.username || 'Sin asignar';
            const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha';

            csv += `${task._id},"${task.title}","${task.status}","${task.priority}","${projectName}","${assignedName}","${dueDate}"\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=tareas.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error al exportar CSV:', error);
        res.status(500).json({
            success: false,
            message: 'Error al exportar CSV'
        });
    }
};
