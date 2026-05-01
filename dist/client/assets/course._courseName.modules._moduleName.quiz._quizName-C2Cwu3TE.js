import{a as e,n as t,t as n}from"./jsx-runtime-dBoqvwbd.js";import{n as r,r as i,t as a}from"./BreadCrumbs-Cg_loSdV.js";import{S as o,c as s,l as c,r as l,u,x as d}from"./index-DRVTVEFd.js";import{t as f}from"./ClientOnly-D1zmjm45.js";import{f as p,n as m,p as h}from"./localCoursesHooks-DI6irJUH.js";import{n as g}from"./courseContext-DGV-E-HY.js";import{f as _,h as v,l as y,t as b,u as x}from"./zod-IH1ygGIO.js";import{s as S}from"./canvasWebRequestUtils-DXZ-FDOZ.js";import{a as C,f as w,i as T,l as E,o as ee,r as te,s as D,t as ne,u as O}from"./CheckIcon-k_IuhJGx.js";import"./browser-DElgfvq-.js";import{a as k,i as re,n as A,o as j,r as ie,t as ae}from"./EditLayout-gwLM8f_o.js";var M=e(t(),1),N=n();function P({moduleName:e,quizName:t}){let{data:n}=O(e,t);return(0,N.jsxs)(`div`,{style:{overflow:`scroll`,height:`100%`},children:[(0,N.jsxs)(`div`,{className:`columns-2`,children:[(0,N.jsx)(`div`,{className:`text-end`,children:`Name`}),(0,N.jsx)(`div`,{children:n.name})]}),(0,N.jsxs)(`div`,{className:`columns-2`,children:[(0,N.jsx)(`div`,{className:`text-end`,children:`Points`}),(0,N.jsx)(`div`,{children:n.questions.reduce((e,t)=>e+t.points,0)})]}),(0,N.jsxs)(`div`,{className:`columns-2`,children:[(0,N.jsx)(`div`,{className:`text-end`,children:`Due Date`}),(0,N.jsx)(`div`,{children:n.dueAt})]}),(0,N.jsxs)(`div`,{className:`columns-2`,children:[(0,N.jsx)(`div`,{className:`text-end`,children:`Lock At`}),(0,N.jsx)(`div`,{children:n.lockAt})]}),(0,N.jsxs)(`div`,{className:`columns-2`,children:[(0,N.jsx)(`div`,{className:`text-end`,children:`Shuffle Answers`}),(0,N.jsx)(`div`,{children:n.shuffleAnswers})]}),(0,N.jsxs)(`div`,{className:`columns-2`,children:[(0,N.jsx)(`div`,{className:`text-end`,children:`Allowed Attempts`}),(0,N.jsx)(`div`,{children:n.allowedAttempts})]}),(0,N.jsxs)(`div`,{className:`columns-2`,children:[(0,N.jsx)(`div`,{className:`text-end`,children:`One Question at a Time`}),(0,N.jsx)(`div`,{children:n.oneQuestionAtATime})]}),(0,N.jsxs)(`div`,{className:`columns-2`,children:[(0,N.jsx)(`div`,{className:`text-end`,children:`Assignment Group Name`}),(0,N.jsx)(`div`,{children:n.localAssignmentGroupName})]}),(0,N.jsx)(i,{markdown:n.description,className:`p-3`}),(0,N.jsx)(`div`,{className:`p-3 rounded-md bg-slate-950 m-5 flex flex-col gap-3`,children:n.questions.map((e,t)=>(0,N.jsx)(F,{question:e},t))}),(0,N.jsx)(`br`,{}),(0,N.jsx)(`br`,{}),(0,N.jsx)(`br`,{}),(0,N.jsx)(`br`,{}),(0,N.jsx)(`br`,{}),(0,N.jsx)(`br`,{}),(0,N.jsx)(`br`,{}),(0,N.jsx)(`br`,{}),(0,N.jsx)(`br`,{})]})}function F({question:e}){return(0,N.jsxs)(`div`,{className:`rounded bg-slate-900 px-2`,children:[(0,N.jsxs)(`div`,{className:`flex flex-row justify-between text-slate-400`,children:[(0,N.jsx)(`div`,{children:e.questionType}),(0,N.jsxs)(`div`,{className:``,children:[e.points,` `,e.points===1?` Point`:` Points`]})]}),(0,N.jsx)(i,{markdown:e.text,className:`ms-4 mb-2`}),(e.correctComments||e.incorrectComments||e.neutralComments)&&(0,N.jsxs)(`div`,{className:` m-2 ps-2 py-1 rounded flex bg-slate-950/50`,children:[(0,N.jsx)(`div`,{children:`Feedback`}),(0,N.jsxs)(`div`,{className:`mx-4 space-y-1`,children:[e.correctComments&&(0,N.jsxs)(`div`,{className:`border-l-2 border-green-700 pl-2 py-1 flex`,children:[(0,N.jsx)(`span`,{className:`text-green-500`,children:`+ `}),(0,N.jsx)(i,{markdown:e.correctComments,className:`ms-4 mb-2`})]}),e.incorrectComments&&(0,N.jsxs)(`div`,{className:`border-l-2 border-red-700 pl-2 py-1 flex`,children:[(0,N.jsx)(`span`,{className:`text-red-500`,children:`- `}),(0,N.jsx)(i,{markdown:e.incorrectComments,className:`ms-4 mb-2`})]}),e.neutralComments&&(0,N.jsxs)(`div`,{className:`border-l-2 border-blue-800 pl-2 py-1 flex`,children:[(0,N.jsx)(`span`,{className:`text-blue-500`,children:`... `}),(0,N.jsx)(i,{markdown:e.neutralComments,className:`ms-4 mb-2`})]})]})]}),e.questionType===D.MATCHING&&(0,N.jsxs)(`div`,{children:[e.answers.map(e=>(0,N.jsxs)(`div`,{className:`mx-3 mb-1 bg-dark rounded border border-slate-600 flex flex-row`,children:[(0,N.jsx)(`div`,{className:`text-right my-auto flex-1 pe-3`,children:ee(e.text)}),(0,N.jsx)(`div`,{className:` flex-1`,children:e.matchedText})]},JSON.stringify(e))),e.matchDistractors.map(e=>(0,N.jsxs)(`div`,{className:`mx-3 mb-1 bg-dark px-2 rounded border flex row`,children:[`DISTRACTOR: `,e]},e))]}),e.questionType!==D.MATCHING&&(0,N.jsx)(`div`,{children:e.answers.map(t=>(0,N.jsxs)(`div`,{className:`mx-3 mb-1 pt-1 border-t border-slate-700 flex flex-row`,children:[(0,N.jsx)(`div`,{className:`w-8 flex flex-col justify-center`,children:t.correct?(0,N.jsx)(ne,{}):e.questionType===D.MULTIPLE_ANSWERS?(0,N.jsx)(`span`,{className:`mx-auto`,children:`[ ]`}):(0,N.jsx)(`div`,{})}),(0,N.jsx)(i,{markdown:t.text,className:`markdownQuizAnswerPreview`})]},JSON.stringify(t)))})]})}function I({moduleName:e,quizName:t,toggleHelp:n}){let r=o(),{courseName:i}=g(),{data:a}=m(),{data:s}=T(),{data:l}=O(e,t),u=te(),f=C(),p=E(),h=x(),{previousUrl:v,nextUrl:b}=re(`quiz`,t,e),S=s?.find(e=>e.title===t);return(0,N.jsxs)(`div`,{className:`p-5 flex flex-row justify-between`,children:[(0,N.jsx)(`div`,{children:(0,N.jsx)(`button`,{onClick:n,children:`Toggle Help`})}),(0,N.jsxs)(`div`,{className:`flex flex-row gap-3 justify-end`,children:[(u.isPending||f.isPending)&&(0,N.jsx)(c,{}),S&&!S.published&&(0,N.jsx)(`div`,{className:`text-rose-300 my-auto`,children:`Not Published`}),!S&&(0,N.jsx)(`button`,{disabled:u.isPending,onClick:()=>u.mutate({quiz:l,moduleName:e}),children:`Add to canvas`}),S&&(0,N.jsx)(`a`,{className:`btn`,target:`_blank`,href:`https://snow.instructure.com/courses/${a.canvasId}/quizzes/${S.id}`,children:`View in Canvas`}),S&&(0,N.jsx)(`button`,{className:`btn-danger`,disabled:f.isPending,onClick:()=>f.mutate(S.id),children:`Delete from Canvas`}),!S&&(0,N.jsx)(y,{modalControl:h,buttonText:`Delete Localy`,buttonClass:`btn-danger`,modalWidth:`w-1/5`,children:({closeModal:n})=>(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`div`,{className:`text-center`,children:`Are you sure you want to delete this quiz locally?`}),(0,N.jsx)(`br`,{}),(0,N.jsxs)(`div`,{className:`flex justify-around gap-3`,children:[(0,N.jsx)(`button`,{onClick:async()=>{await p.mutateAsync({moduleName:e,quizName:t,courseName:i}),r({to:_(i)})},className:`btn-danger`,children:`Yes`}),(0,N.jsx)(`button`,{onClick:n,children:`No`})]})]})}),(0,N.jsx)(d,{className:`btn`,to:_(i),children:`Go Back`}),(0,N.jsx)(ie,{previousUrl:v,nextUrl:b})]})]})}function L({moduleName:e,quizName:t}){let n=x(),{courseName:r}=g(),i=o(),{data:a}=O(e,t),s=w(),[l,u]=(0,M.useState)(a.name),[d,f]=(0,M.useState)(!1);return(0,N.jsx)(`div`,{children:(0,N.jsx)(y,{modalControl:n,buttonText:`Rename Quiz`,buttonClass:`py-0`,modalWidth:`w-1/5`,children:({closeModal:n})=>(0,N.jsxs)(`form`,{onSubmit:async o=>{o.preventDefault(),l===t&&n(),f(!0),await s.mutateAsync({quiz:a,moduleName:e,quizName:l,previousModuleName:e,previousQuizName:t,courseName:r}),i({to:v(r,e,`quiz`,l),replace:!0})},children:[(0,N.jsx)(`div`,{className:`
                text-yellow-300 
                bg-yellow-950/30 
                border-2 
                rounded-lg 
                border-yellow-800 
                p-1 text-sm mb-2`,children:`Warning: does not rename in Canvas`}),(0,N.jsx)(S,{value:l,setValue:u,label:`Rename Quiz`}),(0,N.jsx)(`button`,{className:`w-full my-3`,children:`Save New Name`}),d&&(0,N.jsx)(c,{})]})})})}function R({moduleName:e,quizName:t}){return(0,N.jsxs)(`div`,{className:`py-1 flex flex-row justify-between`,children:[(0,N.jsxs)(`div`,{className:`flex flex-row`,children:[(0,N.jsx)(a,{}),(0,N.jsx)(`span`,{className:`text-slate-500 cursor-default select-none my-auto`,children:(0,N.jsx)(r,{})}),(0,N.jsx)(`div`,{className:`my-auto px-3`,children:t})]}),(0,N.jsx)(`div`,{className:`px-1`,children:(0,N.jsx)(L,{quizName:t,moduleName:e})})]})}var z=b.object({path:b.string(),name:b.string()});b.object({courses:b.array(z),feedbackDelims:b.record(b.string(),b.string()).optional()});var B={correct:`+`,incorrect:`-`,neutral:`...`},V={extractFeedback(e,t=B){let n={correct:[],incorrect:[],neutral:[]},r=[],i=t,a=`none`;for(let t of e.map(e=>e)){let e=t.startsWith(i.correct)?`correct`:t.startsWith(i.incorrect)?`incorrect`:t.startsWith(i.neutral)?`neutral`:`none`;if(e===`none`&&a!==`none`){let e=t.replace(i[a],``).trim();n[a].push(e)}else if(e!==`none`){let r=t.replace(i[e],``).trim();a=e,n[e].push(r)}else r.push(t)}let o=n.correct.filter(e=>e).join(`
`),s=n.incorrect.filter(e=>e).join(`
`),c=n.neutral.filter(e=>e).join(`
`);return{correctComments:o||void 0,incorrectComments:s||void 0,neutralComments:c||void 0,otherLines:r}},formatFeedback(e,t,n,r=B){let i=``;return e&&(i+=`${r.correct} ${e}\n`),t&&(i+=`${r.incorrect} ${t}\n`),n&&(i+=`${r.neutral} ${n}\n`),i&&(i+=`
`),i}};function H(e,t){return Object.fromEntries(Object.entries(e).map(([e,n])=>[e,t[e]??n]))}var U=e=>H(B,e.feedbackDelims??{}),W=[`*a)`,`a)`,`*)`,`)`,`[ ]`,`[]`,`[*]`,`^`,`=`],G=[`a)`,`*a)`,`*)`,`)`],K=[`[ ]`,`[*]`,`[]`],q=e=>{let t=e.replace(/^=\s*/,``).trim(),n=t.match(/^\[([^,]+),\s*([^\]]+)\]$/);if(n){let t=parseFloat(n[1].trim()),r=parseFloat(n[2].trim());return{correct:!0,text:e.trim(),numericalAnswerType:`range_answer`,numericAnswerRangeMin:t,numericAnswerRangeMax:r}}let r=parseFloat(t);return{correct:!0,text:e.trim(),numericalAnswerType:`exact_answer`,numericAnswer:r}},oe=e=>{let[t,...n]=e.replace(/^\^?/,``).split(` - `);return{correct:!0,text:t.trim(),matchedText:n.join(`-`).trim()}},J=(e,t)=>{let n=e.findIndex(e=>W.some(t=>e.trimStart().startsWith(t)));if(n===-1){let n=e.find(e=>e.trim().length>0);throw Error(`question ${t+1}: no answers when detecting question type on ${n}`)}let r=e.slice(n),i=/^(\*?[a-z]?\))|(?<!\S)\[\s*\]|\[\*\]|\^/;return r.reduce((e,t)=>(i.test(t)||e.length===0?e.push(t):e[e.length-1]+=`
`+t,e),[])},Y={parseMarkdown(e,t){if(t===D.NUMERICAL)return q(e);let n=e.startsWith(`*`)||e[1]===`*`;if(t===D.MATCHING)return oe(e);let r=/^(\*?[a-z]?\))|\[\s*\]|\[\*\]|\^ /,i=0;return{correct:n,text:e.replace(r,e=>i++===0?``:e).trim()}},isAnswerLine:e=>W.some(t=>e.startsWith(t)),getQuestionType:(e,t)=>{let n=e[e.length-1].toLowerCase().trim();if(e.length===0)return D.NONE;if(n===`essay`)return D.ESSAY;if(n===`short answer`||n===`short_answer`)return D.SHORT_ANSWER;if(n===`short_answer=`)return D.SHORT_ANSWER_WITH_ANSWERS;if(n.startsWith(`=`))return D.NUMERICAL;let r=J(e,t)[0];return G.some(e=>r.startsWith(e))?D.MULTIPLE_CHOICE:K.some(e=>r.startsWith(e))?D.MULTIPLE_ANSWERS:r.startsWith(`^`)?D.MATCHING:D.NONE},getAnswers:(e,t,n)=>{if(![D.MULTIPLE_CHOICE,D.MULTIPLE_ANSWERS,D.MATCHING,D.SHORT_ANSWER_WITH_ANSWERS,D.NUMERICAL].includes(n))return{answers:[],distractors:[]};n==D.SHORT_ANSWER_WITH_ANSWERS&&(e=e.slice(0,e.length-1));let r=J(e,t).map(e=>Y.parseMarkdown(e,n));return n===D.MATCHING?{answers:r.filter(e=>e.text),distractors:r.filter(e=>!e.text).map(e=>e.matchedText??``)}:{answers:r,distractors:[]}},getAnswerMarkdown:(e,t,n)=>{let r=t.text.startsWith("```")?`
`+t.text:t.text;if(e.questionType===`multiple_answers`)return`${`[${t.correct?`*`:` `}] `}${r}`;if(e.questionType===`matching`)return`^ ${t.text} - ${t.matchedText}`;if(e.questionType===`numerical`)return t.numericalAnswerType===`range_answer`?`= [${t.numericAnswerRangeMin}, ${t.numericAnswerRangeMax}]`:`= ${t.numericAnswer}`;{let e=String.fromCharCode(97+n);return`${`${t.correct?`*`:``}${e}) `}${r}`}}},se=e=>{let t=e[0].toLowerCase().includes(`points: `),n=e.length>0&&e[0].includes(`: `)&&e[0].split(`: `).length>1&&!isNaN(parseFloat(e[0].split(`: `)[1]));return{points:t&&n?parseFloat(e[0].split(`: `)[1]):1,lines:t?e.slice(1):e}},ce=e=>{let{linesWithoutAnswers:t}=e.reduce(({linesWithoutAnswers:e,taking:t},n)=>!t||Y.isAnswerLine(n)?{linesWithoutAnswers:e,taking:!1}:{linesWithoutAnswers:[...e,n],taking:!0},{linesWithoutAnswers:[],taking:!0});return t},le=(e,t)=>{let n=[`essay`,`short answer`,`short_answer`];return n.includes(t)?e.filter(e=>!n.includes(e.toLowerCase())):e},X={toMarkdown(e,t){let n=e.answers.map((t,n)=>Y.getAnswerMarkdown(e,t,n)),r=e.questionType===D.MATCHING?e.matchDistractors?.map(e=>`\n^ - ${e}`).join(``)??``:``,i=V.formatFeedback(e.correctComments,e.incorrectComments,e.neutralComments,t),a=n.join(`
`),o=e.questionType===`essay`||e.questionType===`short_answer`?e.questionType:e.questionType===D.SHORT_ANSWER_WITH_ANSWERS?`\n${D.SHORT_ANSWER_WITH_ANSWERS}`:``;return`Points: ${e.points}\n${e.text}\n${i}${a}${r}${o}`},parseMarkdown(e,t,n){let{points:r,lines:i}=se(e.trim().split(`
`)),a=ce(i),o=Y.getQuestionType(i,t),s=le(a,o),{correctComments:c,incorrectComments:l,neutralComments:u,otherLines:d}=V.extractFeedback(s,n),{answers:f,distractors:p}=Y.getAnswers(i,t,o);return{text:d.join(`
`),questionType:o,points:r,answers:f,matchDistractors:p,correctComments:c,incorrectComments:l,neutralComments:u}}},Z=(e,t)=>{let n=RegExp(`${t}: (.*?)\n`).exec(e);return n?n[1].trim():``},ue=e=>{let t=RegExp(`Description: (.*?)$`,`s`).exec(e);return t?t[1].trim():``},Q=(e,t)=>{if(e.toLowerCase()===`true`)return!0;if(e.toLowerCase()===`false`)return!1;throw Error(`Error with ${t}: ${e}`)},de=(e,t,n)=>e.toLowerCase()===`true`?!0:e.toLowerCase()===`false`?!1:n,fe=(e,t)=>{let n=parseInt(e,10);if(isNaN(n))throw Error(`Error with ${t}: ${e}`);return n},pe=(e,t)=>{let n=Q(Z(e,`ShuffleAnswers`),`ShuffleAnswers`),r=Z(e,`Password`)||void 0,i=de(Z(e,`ShowCorrectAnswers`),`ShowCorrectAnswers`,!0),a=Q(Z(e,`OneQuestionAtATime`),`OneQuestionAtATime`),o=fe(Z(e,`AllowedAttempts`),`AllowedAttempts`),s=p(Z(e,`DueAt`),`DueAt`),c=h(Z(e,`LockAt`));return{name:t,description:ue(e),password:r,lockAt:c,dueAt:s,shuffleAnswers:n,showCorrectAnswers:i,oneQuestionAtATime:a,localAssignmentGroupName:Z(e,`AssignmentGroup`),allowedAttempts:o,questions:[]}},$={toMarkdown(e,t){if(!e)throw Error(`quiz was undefined, cannot parse markdown`);if(e.questions===void 0||e.oneQuestionAtATime===void 0)throw console.log(`quiz is probably not a quiz`,e),Error(`quiz ${e.name} is probably not a quiz`);let n=e.questions.map(e=>X.toMarkdown(e,t)).join(`

---

`);return`LockAt: ${e.lockAt??``}
DueAt: ${e.dueAt}
Password: ${e.password??``}
ShuffleAnswers: ${e.shuffleAnswers.toString().toLowerCase()}
ShowCorrectAnswers: ${e.showCorrectAnswers.toString().toLowerCase()}
OneQuestionAtATime: ${e.oneQuestionAtATime.toString().toLowerCase()}
AssignmentGroup: ${e.localAssignmentGroupName}
AllowedAttempts: ${e.allowedAttempts}
Description: ${e.description}
---
${n}`},parseMarkdown(e,t,n){let r=e.split(`---
`),i=r[0],a=pe(i,t),o=r.slice(1).filter(e=>e.trim().length>0).map((e,t)=>X.parseMarkdown(e,t,n));return{...a,questions:o}}},me=e=>`Assignment Group Names:
- ${e.assignmentGroups.map(e=>e.name).join(`
- `)}

QUESTION REFERENCE
---
Points: 2
this is a question?
*a) correct
b) not correct
---
points: 1
question goes here
[*] correct
[ ] not correct
[] not correct
---
the points default to 1?
*a) true
b) false
---
Markdown is supported

- like
- this
- list

[*] true
[ ] false
---
This is a one point essay question
essay
---
points: 4
this is a short answer question
short_answer
---
points: 4
the underscore is optional
short answer
---
short answer with auto-graded responses
*a) answer 1
*b) other valid answer
short_answer=
---
this is a matching question
^ left answer - right dropdown
^ other thing -  another option
^ - distractor
^ - other distractor
---
Points: 3
FEEDBACK EXAMPLE
What is 2+3?
+ Correct! Good job
- Incorrect, try again
... This is general feedback shown regardless
*a) 4
*b) 5
c) 6
---
Points: 2
FEEDBACK EXAMPLE
Multiline feedback example
+
Great work!
You understand the concept.
-
Not quite right.
Review the material and try again.
*a) correct answer
b) wrong answer`;function he({moduleName:e,quizName:t}){let{data:n}=m(),{courseName:r}=g(),{data:i,dataUpdatedAt:a,isFetching:o}=O(e,t),c=w(),{data:l}=u(),d=U(l??{}),{clientIsAuthoritative:p,text:h,textUpdate:_,monacoKey:v}=A({serverUpdatedAt:a,startingText:$.toMarkdown(i,d)}),[y,b]=(0,M.useState)(``),[x,S]=(0,M.useState)(!1);return(0,M.useEffect)(()=>{let n=setTimeout(async()=>{if(o||c.isPending){console.log(`network requests in progress, not updating page`);return}try{let n=k(h,`Name`);if($.toMarkdown(i,d)!==$.toMarkdown($.parseMarkdown(h,n,d),d))if(p){let n=$.parseMarkdown(h,t,d);await c.mutateAsync({quiz:n,moduleName:e,quizName:t,previousModuleName:e,previousQuizName:t,courseName:r})}else console.log(`client not authoritative, updating client with server quiz`),_($.toMarkdown(i),!0);b(``)}catch(e){b(e.toString())}},1e3);return()=>{clearTimeout(n)}},[p,r,d,o,e,i,t,h,_,c]),(0,N.jsx)(ae,{Header:(0,N.jsx)(R,{moduleName:e,quizName:t}),Body:(0,N.jsxs)(N.Fragment,{children:[x&&(0,N.jsx)(`pre`,{className:` max-w-96 h-full overflow-y-auto`,children:(0,N.jsx)(`code`,{children:me(n)})}),(0,N.jsx)(`div`,{className:`flex-1 h-full`,children:(0,N.jsx)(j,{value:h,onChange:_},v)}),(0,N.jsxs)(`div`,{className:`flex-1 h-full`,children:[(0,N.jsx)(`div`,{className:`text-red-300`,children:y&&y}),(0,N.jsx)(P,{moduleName:e,quizName:t})]})]}),Footer:(0,N.jsx)(f,{children:(0,N.jsx)(s,{children:(0,N.jsx)(I,{moduleName:e,quizName:t,toggleHelp:()=>S(e=>!e)})})})})}function ge(){let{moduleName:e,quizName:t}=l.useParams();return(0,N.jsx)(he,{quizName:decodeURIComponent(t),moduleName:decodeURIComponent(e)})}export{ge as component};