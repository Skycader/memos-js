function split(str){
    const arr = [];
    for(const char of str)
      arr.push(char)
     
    return arr;
  }
  
  const str = "你好🌍🤖😸🎉こんにちはأهلاनमस्ते";
  console.log(split(str))

  //By default, rules for directory defiens if TI can go higher than 2 (each word)