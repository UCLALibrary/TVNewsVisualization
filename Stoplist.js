/**
 * Source:
 *  https://github.com/huned/node-stopwords/blob/master/english.js
 *  https://github.com/6/stopwords-json/blob/master/dist/en.json
 * and additional stopwords encountered
 */

const stoplist = {
    keywords: [
        "a","a's","able","about","above","abroad","according","accordingly","across","actually","adj","after","afterwards","again","against","ago","ahead","ain't","aint","all","allow","allows","almost","alone","along","alongside","already","also","although","always","am","amid","amidst","among","amongst","an","and","another","any","anybody","anyhow","anyone","anything","anyway","anyways","anywhere","apart","appear","appreciate","appropriate","are","aren't","arent","around","as","as","aside","ask","asking","associated","at","available","away","awfully",
        "b","back","backward","backwards","be","became","because","become","becomes","becoming","been","before","beforehand","begin","behind","being","believe","below","beside","besides","best","better","between","beyond","both","brief","but","by",
        "c","c'mon","c's","came","can","can't","cannot","cant","cant","caption","cause","causes","certain","certainly","changes","clearly","cmon","co","co.","com","come","comes","concerning","consequently","consider","considering","contain","containing","contains","corresponding","could","couldn't","couldnt","course","cs","currently",
        "d","dare","darent","definitely","described","despite","did","didn't","didnt","different","directly","do","does","doesn't","doesnt","doing","don't","done","dont","down","downwards","during",
        "e","each","edu","eg","eight","eighty","either","else","elsewhere","end","ending","enough","entirely","especially","et","etc","even","ever","evermore","every","everybody","everyone","everything","everywhere","ex","exactly","example","except",
        "f","fairly","far","farther","few","fewer","fifth","first","five","followed","following","follows","for","forever","former","formerly","forth","forward","found","four","from","further","furthermore",
        "g","get","gets","getting","given","gives","go","goes","going","gone","got","gotten","greetings",
        "h","had","hadn't","hadnt","half","happens","hardly","has","hasn't","hasnt","have","haven't","havent","having","he","he's","hed","hell","hello","help","hence","her","here","here's","hereafter","hereby","herein","heres","hereupon","hers","herself","hes","hi","him","himself","his","hither","hopefully","how","howbeit","however","hundred",
        "i","i'd","i'll","i'm","i've","id","ie","if","ignored","ill","im","immediate","in","inasmuch","inc","inc.","indeed","indicate","indicated","indicates","inner","inside","insofar","instead","into","inward","is","isn't","isnt","it","it'd","it'll","it's","itd","itll","its","its","itself","ive",
        "j","just",
        "k","keep","keeps","kept","know","known","knows",
        "l","last","lately","later","latter","latterly","least","less","lest","let","let's","lets","like","liked","likely","likewise","little","look","looking","looks","low","lower","ltd",
        "m","made","mainly","make","makes","many","may","maybe","maynt","me","mean","meantime","meanwhile","merely","might","mightnt","mine","minus","miss","more","moreover","most","mostly","mr","mrs","much","must","mustnt","my","myself",
        "n","name","namely","nd","near","nearly","necessary","need","neednt","needs","neither","never","neverf","neverless","nevertheless","new","next","nine","ninety","no","no-one","nobody","non","none","nonetheless","noone","nor","normally","not","nothing","notwithstanding","novel","now","nowhere",
        "o","obviously","of","off","often","oh","ok","okay","old","on","once","one","ones","ones","only","onto","opposite","or","other","others","otherwise","ought","oughtnt","our","ours","ourselves","out","outside","over","overall","own",
        "p","particular","particularly","past","per","perhaps","placed","please","plus","possible","presumably","probably","provided","provides",
        "q","que","quite","qv",
        "r","rather","rd","re","really","reasonably","recent","recently","regarding","regardless","regards","relatively","respectively","right","round",
        "s","said","same","saw","say","saying","says","second","secondly","see","seeing","seem","seemed","seeming","seems","seen","self","selves","sensible","sent","serious","seriously","seven","several","shall","shant","she","shed","shell","shes","should","shouldn't","shouldnt","since","six","so","some","somebody","someday","somehow","someone","something","sometime","sometimes","somewhat","somewhere","soon","sorry","specified","specify","specifying","still","sub","such","sup","sure",
        "t","t's","take","taken","taking","tell","tends","th","than","thank","thanks","thanx","that","that's","thatll","thats","thats","thatve","the","their","theirs","them","themselves","then","thence","there","there's","thereafter","thereby","thered","therefore","therein","therell","therere","theres","theres","thereupon","thereve","these","they","they'd","they'll","they're","they've","theyd","theyll","theyre","theyve","thing","things","think","third","thirty","this","thorough","thoroughly","those","though","three","through","throughout","thru","thus","till","to","together","too","took","toward","towards","tried","tries","truly","try","trying","ts","twice","two",
        "u","un","under","underneath","undoing","unfortunately","unless","unlike","unlikely","until","unto","up","upon","upwards","us","use","used","useful","uses","using","usually","uucp",
        "v","value","various","versus","very","via","viz","vs",
        "w","want","wants","was","wasn't","wasnt","way","we","we'd","we'll","we're","we've","wed","welcome","well","well","went","were","were","weren't","werent","weve","what","what's","whatever","whatll","whats","whatve","when","whence","whenever","where","where's","whereafter","whereas","whereby","wherein","wheres","whereupon","wherever","whether","which","whichever","while","whilst","whither","who","who's","whod","whoever","whole","wholl","whom","whomever","whos","whose","why","will","willing","wish","with","within","without","won't","wonder","wont","would","wouldn't","wouldnt",
        "x",
        "y","yes","yet","you","you'd","you'll","you're","you've","youd","youll","your","youre","yours","yourself","yourselves","youve",
        "z","zero"
    ],
    keyphrases: [

    ],
    perfectMatchWords: [
        
    ],
    perfectMatchPhrases: [
        
    ]
};

module.exports = stoplist;