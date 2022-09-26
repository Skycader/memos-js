const notifier = {}
notifier.show = (text,warning) => {
    document.querySelector(".notifier-content").classList.remove("notifier-warning")
    if (warning) document.querySelector(".notifier-content").classList.add("notifier-warning")
    document.querySelector(".notifier-content").innerHTML=text
    document.querySelector(".notifier").classList.toggle("notifier-up")
    setTimeout(()=>{document.querySelector(".notifier").classList.toggle("notifier-up")},2000)
}