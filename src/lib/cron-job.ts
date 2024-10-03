import cron from 'node-cron'
import { deleteTasksFromMonday } from '../../scripts/delete-tasks-from-monday'

export function startCronJobs() {
  cron.schedule('0 0 * * 1', async () => {
    console.log('Iniciando deleção de tarefas da última segunda-feira...')
    await deleteTasksFromMonday()
  })
}
