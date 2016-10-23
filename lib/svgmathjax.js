/*
 * SVG_MathJax
 *
 * Copyright 2014 Jason M. Sachs
 * Based loosely on an approach outlined by Martin Clark
 * in http://stackoverflow.com/a/21923030/44330
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

SvgMathJax = (function() {

  // apply a function to elements of an array x
  function forEach(x,f) {
      var n = x.length; for (var i = 0; i < n; ++i) { f(x[i]); }
  }

  // find all the SVG text elements that are delimited by
  // \( \) or $ $ MathJax delimiters
  // (with optional whitespace before/after)
  function findSVGMathJax(f, context)
  {
      var re = /^\s*([LlRrCc]?)(\\\(.*\\\)|\$.*\$)\s*$/;
      context = context || document;
      forEach(context.getElementsByTagName('svg'), function(svg) {
          forEach(svg.getElementsByTagName('text'), function(t) {
              var m = t.textContent.match(re);
              console.log("Text id = " + t.id);
              if (m)
              {
                  f(svg, t, m);
              }
          });
      });
  }

  function _install(options, callback) {  // pass a call back to do work only conversion to sgv has occured
      var items = [];

      // Move the raw MathJax items to a temporary element
      MathJax.Hub.Register.StartupHook("Begin Typeset",function () {
          var mathbucket = document.createElement('div');
          mathbucket.setAttribute('id','mathjax_svg_bucket');
          document.body.appendChild(mathbucket);
          findSVGMathJax(function(svg, t, m) {
              var d = document.createElement('div');
              mathbucket.appendChild(d);
              var mathmarkup = m[2].replace(/^\$(.*)\$$/,'\\($1\\)');
              d.appendChild(document.createTextNode(mathmarkup));
              t.textContent = '';
              items.push([t,d,m[1]]);
          });

      });

      MathJax.Hub.Register.StartupHook("End Typeset",function() {
          forEach(items, function(x) {

              // get the text-anchor attribute from the text tag
              var t = x[0]
              var textanchor = t.style.textAnchor || "middle"

              var svgdest = x[0];
              var mathjaxdiv = x[1];
              var justification = x[2];
              var svgmath =
                   mathjaxdiv.getElementsByClassName('MathJax_SVG')[0]
                             .getElementsByTagName('svg')[0];
              var svgmathinfo = {
                width: svgmath.viewBox.baseVal.width,
                height: svgmath.viewBox.baseVal.height
              };
              // get graphics nodes
              var gnodes =
                  svgmath.getElementsByTagName('g')[0].cloneNode(true);
              var fontsize = svgdest.getAttribute('font-size');
              var scale = Math.max(0.01,options.scale*fontsize);
              var x =  +svgdest.getAttribute('x');
              var y =  +svgdest.getAttribute('y');

              var x0 = x;
              var y0 = y;
              var x1;

              // change
              // switch (justification.toUpperCase())
              // {
              // case 'L': x1 = 0; break;
              // case 'R': x1 = -svgmathinfo.width; break;
              // case 'C': // default to center
              // default:  x1 = -svgmathinfo.width * 0.5; break;
              // }
              console.log("txt");
              console.log(textanchor);
              switch (textanchor)
              {
              case 'start': x1 = 0; break;
              case 'end': x1 = -svgmathinfo.width; break;
              case 'middle': // default to center
              default:  x1 = -svgmathinfo.width * 0.5; break;
              }


              var y1 = svgmathinfo.height*0;
              var w = svgmathinfo.width
              // console.log(t)
              // console.log(t.id)
              // console.log(t.classList)
              // console.log(gnodes);
              // console.log(svgdest)
              //
              //
              console.log("-----------");
              console.log(gnodes);
              console.log("-----------");

              gnodes.setAttribute('transform',
                'scale('+scale+') ' + 'translate('+x0+' '+y0+') ' + 'translate('+x1+' '+y1+') '
              )
              // gnodes.setAttribute('transform', 'scale('+scale+')' + ' translate('+ 1*-w/2  *scale + ',0)  rotate(30, 0, 0) ')
              // gnodes.setAttribute('transform', ' scale('+scale+')'+' rotate(0) matrix(1 0 0 -1 0 0) ');
              //http://stackoverflow.com/questions/23111772/rotate-svg-css-around-an-arbitrary-point-without-transform-origin
              // gnodes.setAttribute('transform', 'translate('+x0+' '+y0+')'
              //      +' scale('+scale+') translate('+x1+' '+y1+')'
              //      +' matrix(1 0 0 -1 0 0)');

              // transfert text tag class and id to gnodes parent group
              gnodes.id = t.id
              gnodes.classList.add(...t.classList) // ... is the spread operator

              if (options.escape_clip)
                  svgdest.parentNode.removeAttribute('clip-path');
              svgdest.parentNode.replaceChild(gnodes,svgdest);
          });
          // remove the temporary items
          var mathbucket = document.getElementById('mathjax_svg_bucket');
          mathbucket.parentNode.removeChild(mathbucket);

      });

      MathJax.Hub.Register.StartupHook("End",function () {
        callback()
      });

  }

  var F = function()
  {
    this.scale = 0.05;
    this.escape_clip = false;
  };
  F.prototype.install = function(callback) { _install(this, callback)}
  return F;
})();
