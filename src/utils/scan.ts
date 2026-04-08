export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400';
    case 'running':
      return 'bg-green-500/20 text-green-400';
    case 'completed':
      return 'bg-orange-500/20 text-orange-400';
    case 'canceled':
    case 'failed':
      return 'bg-red-500/20 text-red-400';
    default:
      return 'bg-neutral-500/20 text-neutral-300';
  }
};
