class AlgorithmService {

  /* ─── BUBBLE SORT ─── */
  bubbleSort(arr) {
    const steps = [], array = [...arr];
    let comparisons = 0, swaps = 0;
    steps.push({ type:'initial', array:[...array], message:'Starting Bubble Sort' });
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        comparisons++;
        steps.push({ type:'compare', array:[...array], indices:[j,j+1], message:`Comparing ${array[j]} and ${array[j+1]}` });
        if (array[j] > array[j+1]) {
          [array[j], array[j+1]] = [array[j+1], array[j]]; swaps++;
          steps.push({ type:'swap', array:[...array], indices:[j,j+1], message:`Swapped ${array[j+1]} and ${array[j]}` });
        }
      }
      steps.push({ type:'sorted', array:[...array], sortedIndex:array.length-i-1, message:`Position ${array.length-i-1} finalized` });
    }
    steps.push({ type:'complete', array:[...array], message:'Bubble Sort complete!' });
    return { steps, sortedArray:array, comparisons, swaps, timeComplexity:'O(n²)', spaceComplexity:'O(1)' };
  }

  /* ─── INSERTION SORT ─── */
  insertionSort(arr) {
    const steps = [], array = [...arr];
    let comparisons = 0, swaps = 0;
    steps.push({ type:'initial', array:[...array], message:'Starting Insertion Sort' });
    for (let i = 1; i < array.length; i++) {
      const key = array[i];
      let j = i - 1;
      steps.push({ type:'pivot', array:[...array], pivotIndex:i, message:`Key = ${key}, inserting into sorted portion` });
      while (j >= 0 && array[j] > key) {
        comparisons++;
        steps.push({ type:'compare', array:[...array], indices:[j,j+1], message:`${array[j]} > ${key}, shifting right` });
        array[j+1] = array[j]; swaps++;
        steps.push({ type:'swap', array:[...array], indices:[j,j+1], message:`Shifted ${array[j]} to position ${j+1}` });
        j--;
      }
      array[j+1] = key;
      steps.push({ type:'sorted', array:[...array], sortedIndex:j+1, message:`Inserted ${key} at position ${j+1}` });
    }
    steps.push({ type:'complete', array:[...array], message:'Insertion Sort complete!' });
    return { steps, sortedArray:array, comparisons, swaps, timeComplexity:'O(n²)', spaceComplexity:'O(1)' };
  }

  /* ─── SELECTION SORT ─── */
  selectionSort(arr) {
    const steps = [], array = [...arr];
    let comparisons = 0, swaps = 0;
    steps.push({ type:'initial', array:[...array], message:'Starting Selection Sort' });
    for (let i = 0; i < array.length - 1; i++) {
      let minIdx = i;
      steps.push({ type:'pivot', array:[...array], pivotIndex:i, message:`Finding minimum from index ${i}` });
      for (let j = i + 1; j < array.length; j++) {
        comparisons++;
        steps.push({ type:'compare', array:[...array], indices:[minIdx,j], message:`Comparing ${array[minIdx]} and ${array[j]}` });
        if (array[j] < array[minIdx]) { minIdx = j; }
      }
      if (minIdx !== i) {
        [array[i], array[minIdx]] = [array[minIdx], array[i]]; swaps++;
        steps.push({ type:'swap', array:[...array], indices:[i,minIdx], message:`Swapped ${array[minIdx]} and ${array[i]}` });
      }
      steps.push({ type:'sorted', array:[...array], sortedIndex:i, message:`Position ${i} finalized with ${array[i]}` });
    }
    steps.push({ type:'complete', array:[...array], message:'Selection Sort complete!' });
    return { steps, sortedArray:array, comparisons, swaps, timeComplexity:'O(n²)', spaceComplexity:'O(1)' };
  }

  /* ─── QUICK SORT ─── */
  quickSort(arr) {
    const steps = [], array = [...arr];
    let comparisons = 0, swaps = 0;
    steps.push({ type:'initial', array:[...array], message:'Starting Quick Sort' });
    const partition = (low, high) => {
      const pivot = array[high]; let i = low - 1;
      steps.push({ type:'pivot', array:[...array], pivotIndex:high, message:`Pivot = ${pivot}` });
      for (let j = low; j < high; j++) {
        comparisons++;
        steps.push({ type:'compare', array:[...array], indices:[j,high], message:`Comparing ${array[j]} with pivot ${pivot}` });
        if (array[j] < pivot) {
          i++;
          [array[i], array[j]] = [array[j], array[i]]; swaps++;
          steps.push({ type:'swap', array:[...array], indices:[i,j], message:`Swapped ${array[j]} and ${array[i]}` });
        }
      }
      [array[i+1], array[high]] = [array[high], array[i+1]]; swaps++;
      steps.push({ type:'swap', array:[...array], indices:[i+1,high], message:`Pivot ${pivot} placed at index ${i+1}` });
      return i + 1;
    };
    const qs = (low, high) => { if (low < high) { const pi = partition(low,high); qs(low,pi-1); qs(pi+1,high); } };
    qs(0, array.length - 1);
    steps.push({ type:'complete', array:[...array], message:'Quick Sort complete!' });
    return { steps, sortedArray:array, comparisons, swaps, timeComplexity:'O(n log n)', spaceComplexity:'O(log n)' };
  }

  /* ─── MERGE SORT ─── */
  mergeSort(arr) {
    const steps = []; let comparisons = 0;
    steps.push({ type:'initial', array:[...arr], message:'Starting Merge Sort' });
    const merge = (left, right) => {
      const result = []; let i = 0, j = 0;
      while (i < left.length && j < right.length) {
        comparisons++;
        result.push(left[i] <= right[j] ? left[i++] : right[j++]);
      }
      return result.concat(left.slice(i)).concat(right.slice(j));
    };
    const ms = (array) => {
      if (array.length <= 1) return array;
      const mid = Math.floor(array.length / 2);
      const left = array.slice(0, mid), right = array.slice(mid);
      steps.push({ type:'split', left:[...left], right:[...right], array:[...array], message:`Split → [${left}] and [${right}]` });
      const merged = merge(ms(left), ms(right));
      steps.push({ type:'merge', array:[...merged], message:`Merged → [${merged}]` });
      return merged;
    };
    const sortedArray = ms([...arr]);
    steps.push({ type:'complete', array:sortedArray, message:'Merge Sort complete!' });
    return { steps, sortedArray, comparisons, swaps:0, timeComplexity:'O(n log n)', spaceComplexity:'O(n)' };
  }

  /* ─── HEAP SORT ─── */
  heapSort(arr) {
    const steps = [], array = [...arr];
    let comparisons = 0, swaps = 0;
    steps.push({ type:'initial', array:[...array], message:'Starting Heap Sort — building max heap' });
    const heapify = (n, i) => {
      let largest = i, l = 2*i+1, r = 2*i+2;
      if (l < n) { comparisons++; if (array[l] > array[largest]) largest = l; }
      if (r < n) { comparisons++; if (array[r] > array[largest]) largest = r; }
      if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]]; swaps++;
        steps.push({ type:'swap', array:[...array], indices:[i,largest], message:`Heapify: swapped ${array[largest]} and ${array[i]}` });
        heapify(n, largest);
      }
    };
    for (let i = Math.floor(array.length/2)-1; i >= 0; i--) heapify(array.length, i);
    steps.push({ type:'pivot', array:[...array], pivotIndex:0, message:'Max heap built!' });
    for (let i = array.length - 1; i > 0; i--) {
      [array[0], array[i]] = [array[i], array[0]]; swaps++;
      steps.push({ type:'swap', array:[...array], indices:[0,i], message:`Moved max ${array[i]} to position ${i}` });
      steps.push({ type:'sorted', array:[...array], sortedIndex:i, message:`Position ${i} finalized` });
      heapify(i, 0);
    }
    steps.push({ type:'complete', array:[...array], message:'Heap Sort complete!' });
    return { steps, sortedArray:array, comparisons, swaps, timeComplexity:'O(n log n)', spaceComplexity:'O(1)' };
  }

  /* ─── SHELL SORT ─── */
  shellSort(arr) {
    const steps = [], array = [...arr];
    let comparisons = 0, swaps = 0;
    steps.push({ type:'initial', array:[...array], message:'Starting Shell Sort' });
    let gap = Math.floor(array.length / 2);
    while (gap > 0) {
      steps.push({ type:'pivot', array:[...array], pivotIndex:gap, message:`Gap = ${gap}` });
      for (let i = gap; i < array.length; i++) {
        const temp = array[i]; let j = i;
        while (j >= gap) {
          comparisons++;
          steps.push({ type:'compare', array:[...array], indices:[j-gap,j], message:`Comparing ${array[j-gap]} and ${temp}` });
          if (array[j-gap] > temp) { array[j] = array[j-gap]; swaps++; j -= gap; } else break;
        }
        array[j] = temp;
        if (j !== i) steps.push({ type:'swap', array:[...array], indices:[j,i], message:`Placed ${temp} at position ${j}` });
      }
      gap = Math.floor(gap / 2);
    }
    steps.push({ type:'complete', array:[...array], message:'Shell Sort complete!' });
    return { steps, sortedArray:array, comparisons, swaps, timeComplexity:'O(n log n)', spaceComplexity:'O(1)' };
  }

  /* ─── COUNTING SORT ─── */
  countingSort(arr) {
    const steps = [], array = [...arr];
    steps.push({ type:'initial', array:[...array], message:'Starting Counting Sort' });
    const max = Math.max(...array);
    const count = new Array(max + 1).fill(0);
    array.forEach(v => count[v]++);
    steps.push({ type:'pivot', array:[...array], message:`Count array built. Max value = ${max}` });
    let idx = 0;
    for (let i = 0; i <= max; i++) {
      while (count[i]-- > 0) {
        array[idx] = i;
        steps.push({ type:'swap', array:[...array], indices:[idx], message:`Placed ${i} at index ${idx}` });
        idx++;
      }
    }
    steps.push({ type:'complete', array:[...array], message:'Counting Sort complete!' });
    return { steps, sortedArray:array, comparisons:0, swaps:0, timeComplexity:'O(n+k)', spaceComplexity:'O(k)' };
  }

  /* ─── BINARY SEARCH ─── */
  binarySearch(arr, target) {
    const steps = [], array = [...arr].sort((a,b) => a-b);
    let left = 0, right = array.length - 1, comparisons = 0;
    steps.push({ type:'initial', array:[...array], target, message:`Searching for ${target} (sorted array)` });
    while (left <= right) {
      const mid = Math.floor((left+right)/2); comparisons++;
      steps.push({ type:'check', array:[...array], indices:[left,mid,right], message:`Mid = ${array[mid]} at index ${mid}` });
      if (array[mid] === target) {
        steps.push({ type:'found', array:[...array], index:mid, message:`Found ${target} at index ${mid}!` });
        return { steps, found:true, index:mid, comparisons, timeComplexity:'O(log n)', spaceComplexity:'O(1)' };
      }
      if (array[mid] < target) {
        steps.push({ type:'search-right', array:[...array], indices:[mid+1,right], message:`${array[mid]} < ${target} → search right` });
        left = mid + 1;
      } else {
        steps.push({ type:'search-left', array:[...array], indices:[left,mid-1], message:`${array[mid]} > ${target} → search left` });
        right = mid - 1;
      }
    }
    steps.push({ type:'not-found', array:[...array], message:`${target} not found` });
    return { steps, found:false, index:-1, comparisons, timeComplexity:'O(log n)', spaceComplexity:'O(1)' };
  }

  /* ─── LINEAR SEARCH ─── */
  linearSearch(arr, target) {
    const steps = []; let comparisons = 0;
    steps.push({ type:'initial', array:[...arr], target, message:`Searching for ${target}` });
    for (let i = 0; i < arr.length; i++) {
      comparisons++;
      steps.push({ type:'check', array:[...arr], index:i, message:`Checking index ${i}: ${arr[i]}` });
      if (arr[i] === target) {
        steps.push({ type:'found', array:[...arr], index:i, message:`Found ${target} at index ${i}!` });
        return { steps, found:true, index:i, comparisons, timeComplexity:'O(n)', spaceComplexity:'O(1)' };
      }
    }
    steps.push({ type:'not-found', array:[...arr], message:`${target} not found` });
    return { steps, found:false, index:-1, comparisons, timeComplexity:'O(n)', spaceComplexity:'O(1)' };
  }

  /* ─── JUMP SEARCH ─── */
  jumpSearch(arr, target) {
    const steps = [], array = [...arr].sort((a,b) => a-b);
    let comparisons = 0;
    const n = array.length, jump = Math.floor(Math.sqrt(n));
    let prev = 0, step = jump;
    steps.push({ type:'initial', array:[...array], target, message:`Jump size = ${jump}` });
    while (step < n && array[Math.min(step,n)-1] < target) {
      comparisons++;
      steps.push({ type:'search-right', array:[...array], indices:[prev, Math.min(step,n)-1], message:`Jumping: block [${prev}..${Math.min(step,n)-1}]` });
      prev = step; step += jump;
    }
    steps.push({ type:'check', array:[...array], indices:[prev, Math.min(step,n)-1], message:`Linear scan block [${prev}..${Math.min(step,n)-1}]` });
    while (prev < Math.min(step, n)) {
      comparisons++;
      steps.push({ type:'check', array:[...array], index:prev, message:`Checking ${array[prev]}` });
      if (array[prev] === target) {
        steps.push({ type:'found', array:[...array], index:prev, message:`Found ${target} at index ${prev}!` });
        return { steps, found:true, index:prev, comparisons, timeComplexity:'O(√n)', spaceComplexity:'O(1)' };
      }
      prev++;
    }
    steps.push({ type:'not-found', array:[...array], message:`${target} not found` });
    return { steps, found:false, index:-1, comparisons, timeComplexity:'O(√n)', spaceComplexity:'O(1)' };
  }

  /* ─── INTERPOLATION SEARCH ─── */
  interpolationSearch(arr, target) {
    const steps = [], array = [...arr].sort((a,b) => a-b);
    let low = 0, high = array.length - 1, comparisons = 0;
    steps.push({ type:'initial', array:[...array], target, message:`Interpolation Search for ${target}` });
    while (low <= high && target >= array[low] && target <= array[high]) {
      const pos = low + Math.floor(((target - array[low]) / (array[high] - array[low])) * (high - low));
      comparisons++;
      steps.push({ type:'check', array:[...array], indices:[low,pos,high], message:`Probe at index ${pos} = ${array[pos]}` });
      if (array[pos] === target) {
        steps.push({ type:'found', array:[...array], index:pos, message:`Found ${target} at index ${pos}!` });
        return { steps, found:true, index:pos, comparisons, timeComplexity:'O(log log n)', spaceComplexity:'O(1)' };
      }
      if (array[pos] < target) { low = pos + 1; steps.push({ type:'search-right', array:[...array], indices:[low,high], message:`${array[pos]} < ${target} → search right` }); }
      else { high = pos - 1; steps.push({ type:'search-left', array:[...array], indices:[low,high], message:`${array[pos]} > ${target} → search left` }); }
    }
    steps.push({ type:'not-found', array:[...array], message:`${target} not found` });
    return { steps, found:false, index:-1, comparisons, timeComplexity:'O(log log n)', spaceComplexity:'O(1)' };
  }

  /* ─── DISPATCHER ─── */
  execute(algorithmType, input) {
    const { array, target } = input;
    switch (algorithmType) {
      case 'bubble-sort':          return this.bubbleSort(array);
      case 'insertion-sort':       return this.insertionSort(array);
      case 'selection-sort':       return this.selectionSort(array);
      case 'quick-sort':           return this.quickSort(array);
      case 'merge-sort':           return this.mergeSort(array);
      case 'heap-sort':            return this.heapSort(array);
      case 'shell-sort':           return this.shellSort(array);
      case 'counting-sort':        return this.countingSort(array);
      case 'binary-search':        return this.binarySearch(array, target);
      case 'linear-search':        return this.linearSearch(array, target);
      case 'jump-search':          return this.jumpSearch(array, target);
      case 'interpolation-search': return this.interpolationSearch(array, target);
      default: throw new Error(`Algorithm '${algorithmType}' not supported`);
    }
  }
}

export default new AlgorithmService();