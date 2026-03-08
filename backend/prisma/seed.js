import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  await prisma.algorithm.deleteMany();

  const algorithms = [
    // ── Sorting ──
    {
      type: 'bubble-sort', name: 'Bubble Sort', category: 'sorting',
      description: 'Repeatedly compares adjacent elements and swaps them if out of order. Simple but slow for large datasets.',
      timeComplexity: { best:'O(n)', average:'O(n²)', worst:'O(n²)' },
      spaceComplexity: 'O(1)', difficulty: 'easy'
    },
    {
      type: 'insertion-sort', name: 'Insertion Sort', category: 'sorting',
      description: 'Builds the sorted array one element at a time by inserting each into its correct position. Efficient for small or nearly sorted arrays.',
      timeComplexity: { best:'O(n)', average:'O(n²)', worst:'O(n²)' },
      spaceComplexity: 'O(1)', difficulty: 'easy'
    },
    {
      type: 'selection-sort', name: 'Selection Sort', category: 'sorting',
      description: 'Finds the minimum element repeatedly and places it at the beginning. Makes the minimum number of swaps.',
      timeComplexity: { best:'O(n²)', average:'O(n²)', worst:'O(n²)' },
      spaceComplexity: 'O(1)', difficulty: 'easy'
    },
    {
      type: 'quick-sort', name: 'Quick Sort', category: 'sorting',
      description: 'Divide-and-conquer algorithm that partitions the array around a pivot. Very fast in practice.',
      timeComplexity: { best:'O(n log n)', average:'O(n log n)', worst:'O(n²)' },
      spaceComplexity: 'O(log n)', difficulty: 'medium'
    },
    {
      type: 'merge-sort', name: 'Merge Sort', category: 'sorting',
      description: 'Divide-and-conquer that splits, sorts, and merges. Guaranteed O(n log n) — stable sort.',
      timeComplexity: { best:'O(n log n)', average:'O(n log n)', worst:'O(n log n)' },
      spaceComplexity: 'O(n)', difficulty: 'medium'
    },
    {
      type: 'heap-sort', name: 'Heap Sort', category: 'sorting',
      description: 'Uses a max-heap data structure. In-place sort with guaranteed O(n log n) complexity.',
      timeComplexity: { best:'O(n log n)', average:'O(n log n)', worst:'O(n log n)' },
      spaceComplexity: 'O(1)', difficulty: 'medium'
    },
    {
      type: 'shell-sort', name: 'Shell Sort', category: 'sorting',
      description: 'Generalization of insertion sort that allows swapping far-apart elements. Gap sequence determines performance.',
      timeComplexity: { best:'O(n log n)', average:'O(n log² n)', worst:'O(n²)' },
      spaceComplexity: 'O(1)', difficulty: 'medium'
    },
    {
      type: 'counting-sort', name: 'Counting Sort', category: 'sorting',
      description: 'Non-comparison sort that counts occurrences of each element. Very fast for small integer ranges.',
      timeComplexity: { best:'O(n+k)', average:'O(n+k)', worst:'O(n+k)' },
      spaceComplexity: 'O(k)', difficulty: 'medium'
    },
    // ── Searching ──
    {
      type: 'binary-search', name: 'Binary Search', category: 'searching',
      description: 'Efficiently searches sorted arrays by repeatedly halving the search range.',
      timeComplexity: { best:'O(1)', average:'O(log n)', worst:'O(log n)' },
      spaceComplexity: 'O(1)', difficulty: 'easy'
    },
    {
      type: 'linear-search', name: 'Linear Search', category: 'searching',
      description: 'Checks every element sequentially. Works on unsorted arrays. Simple but slow.',
      timeComplexity: { best:'O(1)', average:'O(n)', worst:'O(n)' },
      spaceComplexity: 'O(1)', difficulty: 'easy'
    },
    {
      type: 'jump-search', name: 'Jump Search', category: 'searching',
      description: 'Jumps ahead by √n steps then does linear scan. Better than linear, requires sorted array.',
      timeComplexity: { best:'O(1)', average:'O(√n)', worst:'O(√n)' },
      spaceComplexity: 'O(1)', difficulty: 'medium'
    },
    {
      type: 'interpolation-search', name: 'Interpolation Search', category: 'searching',
      description: 'Improved binary search that estimates position based on value distribution. Best for uniformly distributed data.',
      timeComplexity: { best:'O(1)', average:'O(log log n)', worst:'O(n)' },
      spaceComplexity: 'O(1)', difficulty: 'hard'
    },
  ];

  for (const algo of algorithms) {
    await prisma.algorithm.create({ data: algo });
  }

  console.log(`Created ${algorithms.length} algorithms`);
  console.log('Seeding completed!');
}

main()
  .catch(e => { console.error('Seeding error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });